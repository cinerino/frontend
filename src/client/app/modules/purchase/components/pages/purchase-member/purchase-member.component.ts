import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-member',
    templateUrl: './purchase-member.component.html',
    styleUrls: ['./purchase-member.component.scss']
})
export class PurchaseMemberComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();
    public paymentMethodType = factory.paymentMethodType;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.eventOrders = [];
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.purchase.subscribe((purchase) => {
            if (purchase.order === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const order = purchase.order;
            this.eventOrders = Functions.Purchase.order2EventOrders({ order });
        }).unsubscribe();
    }

}
