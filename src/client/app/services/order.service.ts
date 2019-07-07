import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IPrinter } from '../models';
import { orderAction } from '../store/actions';
import * as reducers from '../store/reducers';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public order: Observable<reducers.IOrderState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions
    ) { }

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
        this.store.dispatch(new orderAction.Delete());
    }

    /**
     * 注文検索
     */
    public search(params: factory.order.ISearchConditions) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new orderAction.Search({ params }));

            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.SearchSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.SearchFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文キャンセル
     */
    public async cancel(orders: factory.order.IOrder[]) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new orderAction.Cancel({ orders }));
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.CancelSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.CancelFail),
                tap(() => { reject(); })
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
            this.store.dispatch(new orderAction.Inquiry(params));
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.InquirySuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.InquiryFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文印刷
     */
    public async print(prams: {
        orders: factory.order.IOrder[];
        printer: IPrinter;
        pos?: factory.seller.IPOS;
        timeout?: number;
    }) {
        return new Promise<void>((resolve, reject) => {
            const orders = prams.orders;
            const pos = prams.pos;
            const printer = prams.printer;
            this.store.dispatch(new orderAction.Print({ orders, pos, printer }));
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.PrintSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.PrintFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文承認
     */
    public async authorize(order: factory.order.IOrder) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new orderAction.OrderAuthorize({
                orderNumber: order.orderNumber,
                customer: {
                    telephone: order.customer.telephone
                }
            }));
            const success = this.actions.pipe(
                ofType(orderAction.ActionTypes.OrderAuthorizeSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(orderAction.ActionTypes.OrderAuthorizeFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
