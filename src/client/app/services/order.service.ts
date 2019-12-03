import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { sleep } from '../functions';
import { IPrinter } from '../models';
import { orderAction } from '../store/actions';
import * as reducers from '../store/reducers';
import { CinerinoService } from './cinerino.service';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public order: Observable<reducers.IOrderState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private cinerino: CinerinoService,
        private utilService: UtilService
    ) {
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
        this.store.dispatch(new orderAction.Delete());
    }

    /**
     * 注文検索
     */
    public async search(params: factory.order.ISearchConditions) {
        try {
            this.utilService.loadStart({ process: 'orderAction.Search' });
            await this.cinerino.getServices();
            const searchResult = await this.cinerino.order.search(params);
            this.utilService.loadEnd();
            return searchResult;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 分割検索
     */
    public async splitSearch(params: factory.order.ISearchConditions) {
        try {
            this.utilService.loadStart({ process: 'orderAction.Search' });
            await this.cinerino.getServices();
            let orders: factory.order.IOrder[] = [];
            const splitDay = 7;
            const splitCount =
                Math.ceil(moment(params.orderDateThrough).diff(moment(params.orderDateFrom), 'days') / splitDay);
            for (let i = 0; i < splitCount; i++) {
                const limit = 100;
                let page = 1;
                let roop = true;
                const orderDateThrough = moment(params.orderDateThrough).add(-1 * splitDay * i, 'days').toDate();
                const orderDateFrom =
                    (moment(params.orderDateThrough).add(-1 * splitDay * (i + 1), 'days').toDate() > <Date>params.orderDateFrom)
                        ? moment(params.orderDateThrough).add(-1 * splitDay * (i + 1), 'days').toDate()
                        : params.orderDateFrom;
                while (roop) {
                    params.limit = limit;
                    params.page = page;
                    const searchResult = await this.cinerino.order.search({ ...params, orderDateThrough, orderDateFrom });
                    orders = orders.concat(searchResult.data);
                    const lastPage = Math.ceil(searchResult.totalCount / limit);
                    page++;
                    roop = !(page > lastPage);
                    await sleep(1000);
                }
            }
            this.utilService.loadEnd();
            return { data: orders, totalCount: orders.length };
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 注文キャンセル
     */
    public async cancel(params: {
        orders: factory.order.IOrder[];
        language: string;
    }) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new orderAction.Cancel(params));
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
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
