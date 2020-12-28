import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
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
    public moment = moment;
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = getEnvironment();
    public code: string;
    private timer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private actionService: ActionService,
        private translate: TranslateService,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.user = this.store.pipe(select(reducers.getUser));
        try {
            const order = (await this.actionService.order.getData()).order;
            if (order === undefined) {
                throw new Error('order undefined');
            }
            if (this.environment.INQUIRY_QRCODE) {
                // 照会ページへQRコード表示ならコード発行
                this.code = await this.actionService.order.authorizeOrder({ order });
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
     * キャンセル確認
     */
    public cancelConfirm() {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('inquiry.confirm.confirm.cancel'),
            cb: async () => {
                try {
                    const userData = await this.actionService.user.getData();
                    let orderData = await this.actionService.order.getData();
                    if (orderData.order === undefined) {
                        throw new Error('order undefined');
                    }
                    const orders = [orderData.order];
                    const language = userData.language;
                    await this.actionService.order.cancel({ orders, language });
                    orderData = await this.actionService.order.getData();
                    if (orderData.order === undefined) {
                        throw new Error('order undefined');
                    }
                    await this.actionService.order.inquiry({
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
        try {
            const { order } = await this.actionService.order.getData();
            const { pos, printer } = await this.actionService.user.getData();
            if (order === undefined
                || pos === undefined
                || printer === undefined) {
                throw new Error('order or pos or printer undefined');
            }
            const today = moment().format('YYYYMMDD');
            const limit = moment(today)
                .add(this.environment.INQUIRY_PRINT_EXPIRED_VALUE, this.environment.INQUIRY_PRINT_EXPIRED_UNIT)
                .format('YYYYMMDD');
            const eventOrders = Functions.Purchase.order2EventOrders({ order });
            const findResult = eventOrders.find(o => moment(o.event.startDate).format('YYYYMMDD') < limit);
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
            const orders = [order];
            await this.actionService.order.print({ orders, pos, printer });
            this.router.navigate(['/inquiry/print']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
