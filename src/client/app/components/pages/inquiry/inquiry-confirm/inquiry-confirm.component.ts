import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { getTicketPrice, IEventOrder, orderToEventOrders } from '../../../../functions';
import { UtilService } from '../../../../services';
import { orderAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';
import { QrCodeModalComponent } from '../../../parts/qrcode-modal/qrcode-modal.component';

@Component({
    selector: 'app-inquiry-confirm',
    templateUrl: './inquiry-confirm.component.html',
    styleUrls: ['./inquiry-confirm.component.scss']
})
export class InquiryConfirmComponent implements OnInit {
    public order: Observable<reducers.IOrderState>;
    public user: Observable<reducers.IUserState>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public eventOrders: IEventOrder[];
    public error: Observable<string | null>;
    public orderStatus: typeof factory.orderStatus = factory.orderStatus;
    public environment = environment;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actions: Actions,
        private modal: NgbModal,
        private util: UtilService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.eventOrders = [];
        this.error = this.store.pipe(select(reducers.getError));
        this.order = this.store.pipe(select(reducers.getOrder));
        this.order.subscribe((value) => {
            if (value.order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const order = value.order;
            this.eventOrders = orderToEventOrders({ order });
        }).unsubscribe();
    }

    /**
     * QRコード表示
     */
    public showQrCode() {
        this.order.subscribe((value) => {
            const order = value.order;
            if (order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new orderAction.OrderAuthorize({
                params: {
                    orderNumber: order.orderNumber,
                    customer: {
                        telephone: order.customer.telephone
                    }
                }
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.OrderAuthorizeSuccess),
            tap(() => {
                this.order.subscribe((inquiry) => {
                    const authorizeOrder = inquiry.order;
                    if (authorizeOrder === undefined) {
                        return;
                    }
                    const modalRef = this.modal.open(QrCodeModalComponent, {
                        centered: true
                    });
                    modalRef.componentInstance.order = authorizeOrder;
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.OrderAuthorizeFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('inquiry.confirm.alert.authorize')
                });
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * キャンセル確認
     */
    public cancelConfirm() {
        this.util.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('inquiry.confirm.confirm.cancel'),
            cb: async () => {
                try {
                    await this.cancel();
                    await this.inquiry();
                } catch (error) {
                    this.error.subscribe((error) => {
                        this.util.openAlert({
                            title: this.translate.instant('common.error'),
                            body: `
                            <p class="mb-4">${this.translate.instant('inquiry.confirm.alert.cancel')}</p>
                                <div class="p-3 bg-light-gray select-text">
                                <code>${JSON.stringify(error)}</code>
                            </div>`
                        });
                    }).unsubscribe();
                }
            }
        });
    }

    /**
     * キャンセル処理
     */
    public cancel() {
        return new Promise((resolve, reject) => {
            this.order.subscribe((orderData) => {
                const order = orderData.order;
                if (order === undefined) {
                    reject({error: 'order undefined'});
                    return;
                }
                this.store.dispatch(new orderAction.Cancel({ orders: [order] }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.CancelSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.CancelFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 照会
     */
    private inquiry() {
        return new Promise((resolve, reject) => {
            this.order.subscribe((orderData) => {
                const order = orderData.order;
                if (order === undefined) {
                    reject({error: 'order undefined'});
                    return;
                }
                this.store.dispatch(new orderAction.Inquiry({
                    confirmationNumber: order.confirmationNumber,
                    customer: { telephone: order.customer.telephone }
                }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.InquirySuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.InquiryFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 印刷
     */
    public print() {
        this.order.subscribe((inquiry) => {
            this.user.subscribe((user) => {
                if (inquiry.order === undefined
                    || user.pos === undefined
                    || user.printer === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                const orders = [inquiry.order];
                const pos = user.pos;
                const printer = user.printer;
                this.store.dispatch(new orderAction.Print({ orders, pos, printer }));
            }).unsubscribe();
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(orderAction.ActionTypes.PrintSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(orderAction.ActionTypes.PrintFail),
            tap(() => {
                this.error.subscribe((error) => {
                    this.util.openAlert({
                        title: this.translate.instant('common.error'),
                        body: `
                        <p class="mb-4">${this.translate.instant('inquiry.confirm.alert.print')}</p>
                            <div class="p-3 bg-light-gray select-text">
                            <code>${error}</code>
                        </div>`
                    });
                }).unsubscribe();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }
}
