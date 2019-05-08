import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IOrderSearchConditions, OrderActions } from '../../../../models';
import { UtilService } from '../../../../services';
import { orderAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';
import { OrderDetailModalComponent } from '../../../parts/order-detail-modal/order-detail-modal.component';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

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
        private actions: Actions,
        private modal: BsModalService,
        private router: Router,
        private util: UtilService,
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
        this.store.dispatch(new orderAction.Delete());
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
    public orderSearch(changeConditions: boolean, event?: { page: number }) {
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
        this.store.dispatch(new orderAction.Search({ params }));

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.SearchSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.SearchFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm(orders: factory.order.IOrder[]) {
        this.util.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('order.list.confirm.cancel'),
            cb: () => {
                this.cancel(orders);
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
     * キャンセル処理
     */
    public cancel(orders: factory.order.IOrder[]) {
        this.store.dispatch(new orderAction.Cancel({ orders }));

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.CancelSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.CancelFail),
            tap(() => {
                this.error.subscribe((error) => {
                    this.util.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('order.list.alert.cancel')}</p>
                            <div class="p-3 bg-light-gray select-text">
                            <code>${error}</code>
                        </div>`
                    });
                }).unsubscribe();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }


    /**
     * 選択した注文へのアクション
     */
    public selecedtAction() {
        if (this.selectedOrders.length === 0) {
            this.util.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.list.alert.unselected')
            });
        }
        if (this.actionSelect === OrderActions.Cancel) {
            this.util.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('order.list.confirm.cancel'),
                cb: () => {
                    this.cancel(this.selectedOrders);
                }
            });
        }
    }

    /**
     * QRコード表示
     */
    public openQrCode(order: factory.order.IOrder) {
        this.store.dispatch(new orderAction.OrderAuthorize({
            params: {
                orderNumber: order.orderNumber,
                customer: {
                    telephone: order.customer.telephone
                }
            }
        }));

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.OrderAuthorizeSuccess),
            tap(() => {
                this.order.subscribe((inquiry) => {
                    const authorizeOrder = inquiry.order;
                    if (authorizeOrder === undefined) {
                        return;
                    }
                    this.modal.show(QrCodeModalComponent, {
                        initialState: { order: authorizeOrder },
                        class: 'modal-dialog-centered'
                    });
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.OrderAuthorizeFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('order.list.alert.authorize')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
