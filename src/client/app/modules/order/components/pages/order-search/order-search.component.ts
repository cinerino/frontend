import { Component, OnInit, ViewChild } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsDatepickerDirective, BsLocaleService, BsModalService } from 'ngx-bootstrap';
import { BsDatepickerContainerComponent } from 'ngx-bootstrap/datepicker/themes/bs/bs-datepicker-container.component';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { iOSDatepickerTapBugFix, orderToEventOrders } from '../../../../../functions';
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
    public isDownload: boolean;
    public error: Observable<string | null>;
    public user: Observable<reducers.IUserState>;
    public orders: factory.order.IOrder[];
    public totalCount: number;
    public moment: typeof moment = moment;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public paymentMethodType: typeof factory.paymentMethodType = factory.paymentMethodType;
    public limit: number;
    public conditions: IOrderSearchConditions;
    public confirmedConditions: IOrderSearchConditions;
    public selectedOrders: factory.order.IOrder[];
    public OrderActions: typeof OrderActions = OrderActions;
    public actionSelect: OrderActions | '';
    public environment = environment;
    public orderToEventOrders = orderToEventOrders;
    @ViewChild('orderDateFrom', { static: true })
    private orderDateFrom: BsDatepickerDirective;
    @ViewChild('orderDateThrough', { static: true })
    private orderDateThrough: BsDatepickerDirective;
    @ViewChild('eventStartDateFrom', { static: true })
    private eventStartDateFrom: BsDatepickerDirective;
    @ViewChild('eventStartDateThrough', { static: true })
    private eventStartDateThrough: BsDatepickerDirective;

    constructor(
        private store: Store<reducers.IOrderState>,
        private modal: BsModalService,
        private utilService: UtilService,
        private userService: UserService,
        private orderService: OrderService,
        private translate: TranslateService,
        private localeService: BsLocaleService,
    ) { }

    public ngOnInit() {
        this.isDownload = false;
        this.actionSelect = '';
        this.selectedOrders = [];
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.user = this.store.pipe(select(reducers.getUser));
        this.orders = [];
        this.totalCount = 0;
        this.limit = 20;
        const now = moment().toDate();
        const today = moment(moment(now).format('YYYYMMDD'));
        this.conditions = {
            orderDateFrom: moment(today).add(-2, 'week').toDate(),
            orderDateThrough: moment(today).toDate(),
            confirmationNumber: '',
            orderNumber: '',
            customer: {
                familyName: '',
                givenName: '',
                email: '',
                telephone: ''
            },
            orderStatus: '',
            paymentMethodType: '',
            page: 1
        };
        this.orderService.delete();
    }

    /**
     * 選択判定
     */
    public isSelected(order: factory.order.IOrder) {
        const findResult = this.selectedOrders.find(o => o.orderNumber === order.orderNumber);
        return findResult !== undefined;
    }

    /**
     * 選択中へ変更
     */
    public addOrder(order: factory.order.IOrder) {
        this.selectedOrders.push(order);
    }

    /**
     * 選択中解除
     */
    public removeOrder(order: factory.order.IOrder) {
        const findIndex = this.selectedOrders.findIndex(o => o.orderNumber === order.orderNumber);
        this.selectedOrders.splice(findIndex, 1);
    }

    /**
     * 検索パラメータへ変換
     */
    public async convertToSearchParams() {
        return new Promise<factory.order.ISearchConditions>((resolve) => {
            const identifiers: factory.propertyValue.IPropertyValue<string>[] = [];
                const params: factory.order.ISearchConditions = {
                    seller: {
                        typeOf: (this.confirmedConditions.seller === undefined)
                            ? undefined : this.confirmedConditions.seller.typeOf,
                        ids: (this.confirmedConditions.seller === undefined)
                            ? undefined : [this.confirmedConditions.seller.id]
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
                        identifiers
                    },
                    orderStatuses: (this.confirmedConditions.orderStatus === '')
                        ? undefined : [this.confirmedConditions.orderStatus],
                    orderDateFrom: (this.confirmedConditions.orderDateFrom === undefined)
                        ? undefined
                        : moment(moment(this.confirmedConditions.orderDateFrom).format('YYYYMMDD')).toDate(),
                    orderDateThrough: (this.confirmedConditions.orderDateThrough === undefined)
                        ? undefined
                        : moment(moment(this.confirmedConditions.orderDateThrough).format('YYYYMMDD')).add(1, 'day').toDate(),
                    confirmationNumbers: (this.confirmedConditions.confirmationNumber === '')
                        ? undefined : [this.confirmedConditions.confirmationNumber],
                    orderNumbers: (this.confirmedConditions.orderNumber === '')
                        ? undefined : [this.confirmedConditions.orderNumber],
                    paymentMethods: (this.confirmedConditions.paymentMethodType === '')
                        ? undefined : { typeOfs: [this.confirmedConditions.paymentMethodType] },
                    acceptedOffers: {
                        itemOffered: {
                            reservationFor: {
                                inSessionFrom: (this.confirmedConditions.eventStartDateFrom === undefined)
                                    ? undefined
                                    : moment(moment(this.confirmedConditions.eventStartDateFrom).format('YYYYMMDD')).toDate(),
                                inSessionThrough: (this.confirmedConditions.eventStartDateThrough === undefined)
                                    ? undefined
                                    : moment(moment(this.confirmedConditions.eventStartDateThrough)
                                        .format('YYYYMMDD')).add(1, 'day').toDate(),
                            }
                        }
                    },
                    limit: this.limit,
                    page: this.confirmedConditions.page,
                    sort: {
                        orderDate: factory.sortType.Descending
                    }
                };
                resolve(params);
        });
    }

    /**
     * 検索
     */
    public async orderSearch(changeConditions: boolean, event?: { page: number }) {
        this.selectedOrders = [];
        if (event !== undefined) {
            this.confirmedConditions.page = event.page;
        }
        // iOS bugfix
        this.conditions.confirmationNumber
            = (<HTMLInputElement>document.getElementById('confirmationNumber')).value;
        this.conditions.orderNumber
            = (<HTMLInputElement>document.getElementById('orderNumber')).value;
        this.conditions.customer.familyName
            = (<HTMLInputElement>document.getElementById('familyName')).value;
        this.conditions.customer.givenName
            = (<HTMLInputElement>document.getElementById('givenName')).value;
        this.conditions.customer.email
            = (<HTMLInputElement>document.getElementById('email')).value;
        this.conditions.customer.telephone
            = (<HTMLInputElement>document.getElementById('telephone')).value;
        if (changeConditions) {
            this.confirmedConditions = {
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
                orderStatus: this.conditions.orderStatus,
                paymentMethodType: this.conditions.paymentMethodType,
                eventStartDateFrom: this.conditions.eventStartDateFrom,
                eventStartDateThrough: this.conditions.eventStartDateThrough,
                page: 1
            };
        }
        try {
            this.totalCount = 0;
            this.orders = [];
            const params = await this.convertToSearchParams();
            const searchResult = await this.orderService.splitSearch(params);
            this.totalCount = searchResult.totalCount;
            this.orders = searchResult.data;
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.search.alert.search')
            });
        }
    }

    /**
     * 検索条件クリア
     */
    public searchConditionClear() {
        const now = moment().toDate();
        const today = moment(moment(now).format('YYYYMMDD'));
        this.conditions = {
            orderDateFrom: moment(today).add(-2, 'week').toDate(),
            orderDateThrough: moment(today).toDate(),
            confirmationNumber: '',
            orderNumber: '',
            customer: {
                familyName: '',
                givenName: '',
                email: '',
                telephone: ''
            },
            orderStatus: '',
            paymentMethodType: '',
            page: 1
        };
        // iOS bugfix
        (<HTMLInputElement>document.getElementById('confirmationNumber')).value = '';
        (<HTMLInputElement>document.getElementById('orderNumber')).value = '';
        (<HTMLInputElement>document.getElementById('familyName')).value = '';
        (<HTMLInputElement>document.getElementById('givenName')).value = '';
        (<HTMLInputElement>document.getElementById('email')).value = '';
        (<HTMLInputElement>document.getElementById('telephone')).value = '';
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm(orders: factory.order.IOrder[]) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('order.search.confirm.cancel'),
            cb: async () => {
                try {
                    const userData = await this.userService.getData();
                    await this.orderService.cancel({ orders, language: userData.language });
                    this.orderSearch(false, { page: this.confirmedConditions.page });
                } catch (error) {
                    console.error(error);
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('order.search.alert.cancel')}</p>
                            <div class="p-3 bg-light-gray select-text">
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
            class: 'modal-dialog-centered modal-lg',
            initialState: { order }
        });
    }

    /**
     * 選択した注文へのアクション
     */
    public selectedAction() {
        if (this.selectedOrders.length === 0) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.search.alert.unselected')
            });
        }
        if (this.actionSelect === OrderActions.Cancel) {
            this.utilService.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('order.search.confirm.cancel'),
                cb: async () => {
                    try {
                        const userData = await this.userService.getData();
                        await this.orderService.cancel({
                            orders: this.selectedOrders,
                            language: userData.language
                        });
                        this.orderSearch(false, { page: this.confirmedConditions.page });
                    } catch (error) {
                        console.error(error);
                        this.utilService.openAlert({
                            title: this.translate.instant('common.error'),
                            body: `
                            <p class="mb-4">${this.translate.instant('order.search.alert.cancel')}</p>
                                <div class="p-3 bg-light-gray select-text">
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
    public async openQrCode(order: factory.order.IOrder) {
        try {
            await this.orderService.authorize(order);
            const orderData = await this.orderService.getData();
            const authorizeOrder = orderData.order;
            if (authorizeOrder === undefined) {
                return;
            }
            this.modal.show(QrCodeModalComponent, {
                class: 'modal-dialog-centered',
                initialState: { order: authorizeOrder },
            });
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('order.search.alert.authorize')
            });
        }
    }

    /**
     * DatePicker設定
     */
    public setDatePicker() {
        this.user.subscribe((user) => {
            this.localeService.use(user.language);
        }).unsubscribe();
    }

    /**
     * iOS bugfix（2回タップしないと選択できない）
     */
    public onShowPicker(container: BsDatepickerContainerComponent) {
        iOSDatepickerTapBugFix(container, [
            this.orderDateFrom,
            this.orderDateThrough,
            this.eventStartDateFrom,
            this.eventStartDateThrough
        ]);
    }

}
