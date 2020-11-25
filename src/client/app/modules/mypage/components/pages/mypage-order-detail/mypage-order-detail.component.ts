import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-mypage-order-detail',
    templateUrl: './mypage-order-detail.component.html',
    styleUrls: ['./mypage-order-detail.component.scss']
})
export class MypageOrderDetailComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public authorizeOrders: { order: factory.order.IOrder; code?: string; }[];
    public moment = moment;

    constructor(
        private store: Store<reducers.IState>,
        private actionService: ActionService,
        private activatedRoute: ActivatedRoute
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.authorizeOrders = [];
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        const searchResult = await this.actionService.order.search({
            orderNumbers: [this.activatedRoute.snapshot.params.orderNumber],
            orderDateFrom: moment().add(-6, 'month').toDate(),
            orderDateThrough: moment().toDate()
        });
        for (const order of searchResult.data) {
            const code = await this.actionService.order.authorizeOrder({ order });
            this.authorizeOrders.push({ order, code });
        }
    }

}

