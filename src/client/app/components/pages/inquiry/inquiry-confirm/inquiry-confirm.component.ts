import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { changeTicketCountByOrder, getTicketPrice, IEventOrder, orderToEventOrders } from '../../../../functions';
import { OrderService, UserService, UtilService } from '../../../../services';
import * as reducers from '../../../../store/reducers';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

@Component({
    selector: 'app-inquiry-confirm',
    templateUrl: './inquiry-confirm.component.html',
    styleUrls: ['./inquiry-confirm.component.scss']
})
export class InquiryConfirmComponent implements OnInit, OnDestroy {
    public order: Observable<reducers.IOrderState>;
    public user: Observable<reducers.IUserState>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public changeTicketCountByOrder = changeTicketCountByOrder;
    public eventOrders: IEventOrder[];
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = environment;
    private timer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private modal: BsModalService,
        private utilService: UtilService,
        private orderService: OrderService,
        private userService: UserService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.eventOrders = [];
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.user = this.store.pipe(select(reducers.getUser));
        this.order.subscribe((value) => {
            if (value.order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const order = value.order;
            this.eventOrders = orderToEventOrders({ order });
        }).unsubscribe();
        if (environment.INQUIRY_PRINT_WAIT_TIME !== '') {
            const time = Number(environment.INQUIRY_PRINT_WAIT_TIME);
            this.timer = setTimeout(() => {
                this.router.navigate(['/inquiry/input']);
            }, time);
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
    public async showQrCode() {
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
                    let orderData = await this.orderService.getData();
                    if (orderData.order === undefined) {
                        throw new Error('order undefined');
                    }
                    const orders = [orderData.order];
                    await this.orderService.cancel(orders);
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
