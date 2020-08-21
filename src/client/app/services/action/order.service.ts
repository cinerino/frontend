import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Models } from '../..';
import { orderAction } from '../../store/actions';
import * as reducers from '../../store/reducers';

@Injectable({
    providedIn: 'root'
})
export class ActionOrderService {
    public order: Observable<reducers.IOrderState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions    ) {
        this.order = this.store.pipe(select(reducers.getOrder));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 注文データ取得
     */
    public async getData() {
        return new Promise<reducers.IOrderState>((resolve) => {
            this.order.subscribe((order) => {
                resolve(order);
            }).unsubscribe();
        });
    }

    /**
     * 注文データ削除
     */
    public delete() {
        this.store.dispatch(orderAction.remove());
    }

    /**
     * 注文キャンセル
     */
    public async cancel(params: {
        orders: factory.order.IOrder[];
        language: string;
    }) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(orderAction.cancel(params));
            const success = this.actions.pipe(
                ofType(orderAction.cancelSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.cancelFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文照会
     */
    public async inquiry(params: {
        confirmationNumber: string;
        customer: {
            email?: string;
            telephone?: string;
        }
    }) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(orderAction.inquiry(params));
            const success = this.actions.pipe(
                ofType(orderAction.inquirySuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.inquiryFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文印刷
     */
    public async print(prams: {
        orders: factory.order.IOrder[];
        printer: Models.Common.Printer.IPrinter;
        pos?: factory.chevre.place.movieTheater.IPOS;
        timeout?: number;
    }) {
        return new Promise<void>((resolve, reject) => {
            const orders = prams.orders;
            const pos = prams.pos;
            const printer = prams.printer;
            this.store.dispatch(orderAction.print({ orders, pos, printer }));
            const success = this.actions.pipe(
                ofType(orderAction.printSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.printFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文承認
     */
    public async authorize(order: factory.order.IOrder) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(orderAction.orderAuthorize({
                orderNumber: order.orderNumber,
                customer: {
                    telephone: order.customer.telephone
                }
            }));
            const success = this.actions.pipe(
                ofType(orderAction.orderAuthorizeSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(orderAction.orderAuthorizeFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
