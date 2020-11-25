import { Component, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-mypage-order',
    templateUrl: './mypage-order.component.html',
    styleUrls: ['./mypage-order.component.scss']
})
export class MypageOrderComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public orders: factory.order.IOrder[];
    public moment = moment;
    public order2EventOrders = Functions.Purchase.order2EventOrders;

    constructor(
        private store: Store<reducers.IState>,
        private actionServie: ActionService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.orders = [];
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        const searchResult = await this.actionServie.order.search({
            orderDateFrom: moment().add(-6, 'month').toDate(),
            orderDateThrough: moment().toDate()
        });
        this.orders = searchResult.data;

    }

}

