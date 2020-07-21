import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { OrderService, QRCodeService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-inquiry-confirm',
    templateUrl: './inquiry-confirm.component.html',
    styleUrls: ['./inquiry-confirm.component.scss']
})
export class InquiryConfirmComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public order: Observable<reducers.IOrderState>;
    public user: Observable<reducers.IUserState>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = getEnvironment();
    private timer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private orderService: OrderService,
        private userService: UserService,
        private translate: TranslateService,
        private qrcodeService: QRCodeService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.eventOrders = [];
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.user = this.store.pipe(select(reducers.getUser));
        try {
            let order = (await this.orderService.getData()).order;
            if (order === undefined) {
                throw new Error('order undefined');
            }
            this.eventOrders = Functions.Purchase.order2EventOrders({ order });
            const findResult = this.eventOrders.find(o => Functions.Order.isShowQRCode(o.event));
            if (this.environment.INQUIRY_QRCODE && findResult !== undefined) {
                await this.orderService.authorize(order);
                order = (await this.orderService.getData()).order;
                if (order === undefined) {
                    throw new Error('order undefined');
                }
                this.eventOrders = Functions.Purchase.order2EventOrders({ order });
            }
            if (this.environment.INQUIRY_PRINT_WAIT_TIME !== '') {
                const time = Number(this.environment.INQUIRY_PRINT_WAIT_TIME);
                this.timer = setTimeout(() => {
                    this.router.navigate(['/inquiry/input']);
                }, time);
            }
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        if (this.timer === undefined) {
            return;
        }
        clearTimeout(this.timer);
    }

    /**
     * QRコード表示
     */
    public async openQRCodeViewer(params: { id: string }) {
        try {
            let order = (await this.orderService.getData()).order;
            if (order === undefined) {
                throw new Error('order undefined');
            }
            await this.orderService.authorize(order);
            order = (await this.orderService.getData()).order;
            const authorizeOrder = order;
            if (authorizeOrder === undefined) {
                throw new Error('authorizeOrder undefined');
            }
            const findResult = authorizeOrder.acceptedOffers.find((a) => {
                return (a.itemOffered.typeOf === factory.chevre.reservationType.EventReservation
                    && (<factory.chevre.reservation.IReservation<
                        factory.chevre.reservationType.EventReservation
                    >>a.itemOffered).id === params.id);
            });
            if (findResult === undefined) {
                throw new Error('itemOffered notfound');
            }
            if (findResult.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                throw new Error('itemOffered typeOf missmatch');
            }
            const itemOffered = <factory.chevre.reservation.IReservation<
                factory.chevre.reservationType.EventReservation
            >>findResult.itemOffered;
            this.qrcodeService.openQRCodeViewer({
                title: this.translate.instant('inquiry.confirm.qrcode.title'),
                code: <string>(itemOffered.reservedTicket.ticketToken)
            });
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('inquiry.confirm.alert.authorize')
            });
        }
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm() {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('inquiry.confirm.confirm.cancel'),
            cb: async () => {
                try {
                    const userData = await this.userService.getData();
                    let orderData = await this.orderService.getData();
                    if (orderData.order === undefined) {
                        throw new Error('order undefined');
                    }
                    const orders = [orderData.order];
                    const language = userData.language;
                    await this.orderService.cancel({ orders, language });
                    orderData = await this.orderService.getData();
                    if (orderData.order === undefined) {
                        throw new Error('order undefined');
                    }
                    await this.orderService.inquiry({
                        confirmationNumber: orderData.order.confirmationNumber,
                        customer: { telephone: orderData.order.customer.telephone }
                    });
                } catch (error) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('inquiry.confirm.alert.cancel')}</p>
                        <div class="p-3 bg-light-gray select-text error">
                            <code>${error}</code>
                        </div>`
                    });
                }
            }
        });
    }

    /**
     * 印刷
     */
    public async print() {
        const today = moment().format('YYYYMMDD');
        const limit = moment(today)
            .add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE, this.environment.INQUIRY_PRINT_EXPIRED_UNIT)
            .format('YYYYMMDD');
        const findResult = this.eventOrders.find(o => moment(o.event.startDate).format('YYYYMMDD') < limit);
        if (findResult !== undefined) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('inquiry.confirm.alert.printExpired')
            });
            return;
        }
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
        try {
            const orderData = await this.orderService.getData();
            const user = await this.userService.getData();
            if (orderData.order === undefined
                || user.pos === undefined
                || user.printer === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const orders = [orderData.order];
            const pos = user.pos;
            const printer = user.printer;
            await this.orderService.print({ orders, pos, printer });
            this.router.navigate(['/inquiry/print']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
