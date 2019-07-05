import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
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
     * 注文検索
     */
    public search() {

    }

    /**
     * 注文キャンセル
     */
    public cancel() {

    }

    /**
     * 注文照会
     */
    public inquiry() {

    }

    /**
     * 注文印刷
     */
    public print() {

    }

    /**
     * 注文承認
     */
    public authorize() {

    }

}
