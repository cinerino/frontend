import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { IOrderSearchConditions, OrderActions } from '../../../../../models';
import { OrderService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';
import { OrderDetailModalComponent } from '../../../../shared/components/parts/order-detail-modal/order-detail-modal.component';
import { QrCodeModalComponent } from '../../../../shared/components/parts/qrcode-modal/qrcode-modal.component';

@Component({
    selector: 'app-order-search',
    templateUrl: './order-search.component.html',
    styleUrls: ['./order-search.component.scss']
})
export class OrderSearchComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public order: Observable<reducers.IOrderState>;
    public master: Observable<reducers.IMasterState>;
    public moment: typeof moment = moment;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public limit: number;
    public conditions: IOrderSearchConditions;
    public confirmedConditions: IOrderSearchConditions;
    public selectedOrders: factory.order.IOrder[];
    public OrderActions: typeof OrderActions = OrderActions;
    public actionSelect: OrderActions | '';

    constructor(
        private store: Store<reducers.IOrderState>,
        private modal: BsModalService,
        private router: Router,
        private userService: UserService,
        private utilService: UtilService,
        private orderService: OrderService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.actionSelect = '';
        this.selectedOrders = [];
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.limit = 20;
        this.conditions = {
            sellerId: '',
            orderDateFrom: '',
            orderDateThrough: '',
            confirmationNumber: '',
            orderNumber: '',
            customer: {
                familyName: '',
                givenName: '',
                email: '',
                telephone: ''
            },
            orderStatuses: '',
            page: 1
        };
        this.orderService.delete();
    }

    /**
     * 注文選択判定
     * @param order
     */
    public isSelected(order: factory.order.IOrder) {
        const findResult = this.selectedOrders.find(o => o.orderNumber === order.orderNumber);
        return findResult !== undefined;
    }

    /**
     * 注文を選択へ変更
     * @param order
     */
    public addOrder(order: factory.order.IOrder) {
        this.selectedOrders.push(order);
    }

    /**
     * 注文を未選択へ変更
     * @param order
     */
    public removeOrder(order: factory.order.IOrder) {
        const findIndex = this.selectedOrders.findIndex(o => o.orderNumber === order.orderNumber);
        this.selectedOrders.splice(findIndex, 1);
    }

    /**
     * 注文を検索
     * @param changeConditions
     */
    public async orderSearch(changeConditions: boolean, event?: { page: number }) {
        this.selectedOrders = [];
        if (event !== undefined) {
            this.confirmedConditions.page = event.page;
        }
        if (changeConditions) {
            this.confirmedConditions = {
                sellerId: this.conditions.sellerId,
                orderDateFrom: this.conditions.orderDateFrom,
                orderDateThrough: this.conditions.orderDateThrough,
                confirmationNumber: this.conditions.confirmationNumber,
                orderNumber: this.conditions.orderNumber,
                customer: {
                    familyName: this.conditions.customer.familyName,
                    givenName: this.conditions.customer.givenName,
                    email: this.conditions.customer.email,
                    telephone: this.conditions.customer.telephone
                },
                orderStatuses: this.conditions.orderStatuses,
                page: 1
            };
        }
        const params = {
            seller: {
                ids: (this.confirmedConditions.sellerId === '')
                    ? undefined : [this.confirmedConditions.sellerId]
            },
            customer: {
                email: (this.confirmedConditions.customer.email === '')
                    ? undefined : this.confirmedConditions.customer.email,
                telephone: (this.confirmedConditions.customer.telephone === '')
                    ? undefined : this.confirmedConditions.customer.telephone,
                familyName: (this.confirmedConditions.customer.familyName === '')
                    ? undefined : this.confirmedConditions.customer.familyName,
                givenName: (this.confirmedConditions.customer.givenName === '')
                    ? undefined : this.confirmedConditions.customer.givenName,
            },
            orderStatuses: (this.confirmedConditions.orderStatuses === '')
                ? undefined : [this.confirmedConditions.orderStatuses],
            orderDateFrom: (this.confirmedConditions.orderDateFrom === '')
                ? moment('1970-01-01').toDate() : moment(this.confirmedConditions.orderDateFrom).toDate(),
            orderDateThrough: (this.confirmedConditions.orderDateThrough === '')
                ? moment().add(1, 'day').toDate() : moment(this.confirmedConditions.orderDateThrough).add(1, 'day').toDate(),
            confirmationNumbers: (this.confirmedConditions.confirmationNumber === '')
                ? undefined : [this.confirmedConditions.confirmationNumber],
            orderNumbers: (this.confirmedConditions.orderNumber === '')
                ? undefined : [this.confirmedConditions.orderNumber],
            limit: this.limit,
            page: this.confirmedConditions.page,
            sort: {
                orderDate: factory.sortType.Descending
            }
        };
        try {
            await this.orderService.search(params);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm(orders: factory.order.IOrder[]) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('order.list.confirm.cancel'),
            cb: async () => {
                try {
                    const userData = await this.userService.getData();
                    const language = userData.language;
                    await this.orderService.cancel({ orders, language });
                } catch (error) {
                    console.error(error);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('order.list.alert.cancel')}</p>
                        <div class="p-3 bg-light-gray select-text error">
                            <code>${error}</code>
                        </div>`
                    });
                }
            }
        });
    }

    /**
     * 詳細を表示
     */
    public openDetail(order: factory.order.IOrder) {
        this.modal.show(OrderDetailModalComponent, {
            initialState: { order },
            class: 'modal-dialog-centered'
        });
    }

    /**
     * 選択した注文へのアクション
     */
    public selecedtAction() {
        if (this.selectedOrders.length === 0) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.list.alert.unselected')
            });
        }
        if (this.actionSelect === OrderActions.Cancel) {
            this.utilService.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('order.list.confirm.cancel'),
                cb: async () => {
                    try {
                        const userData = await this.userService.getData();
                        const language = userData.language;
                        await this.orderService.cancel({
                            orders: this.selectedOrders,
                            language
                        });
                    } catch (error) {
                        console.error(error);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: `
                            <p class="mb-4">${this.translate.instant('order.list.alert.cancel')}</p>
                            <div class="p-3 bg-light-gray select-text error">
                                <code>${error}</code>
                            </div>`
                        });
                    }
                }
            });
        }
    }

    /**
     * QRコード表示
     */
    public async openQrCode() {
        try {
            let orderData = await this.orderService.getData();
            if (orderData.order === undefined) {
                throw new Error('order undefined');
            }
            await this.orderService.authorize(orderData.order);
            orderData = await this.orderService.getData();
            const authorizeOrder = orderData.order;
            if (authorizeOrder === undefined) {
                throw new Error('authorizeOrder undefined');
            }
            this.modal.show(QrCodeModalComponent, {
                initialState: { order: authorizeOrder },
                class: 'modal-dialog-centered'
            });
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.list.alert.authorize')
            });
        }
    }

}
