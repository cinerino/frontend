import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { PurchaseService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-complete',
    templateUrl: './purchase-complete.component.html',
    styleUrls: ['./purchase-complete.component.scss']
})
export class PurchaseCompleteComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();
    public paymentMethodType = factory.paymentMethodType;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private purchaseService: PurchaseService,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.eventOrders = [];
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        const purchase = await this.purchaseService.getData();
        if (purchase.order === undefined) {
            this.router.navigate(['/error']);
            return;
        }
        const order = purchase.order;
        this.eventOrders = Functions.Purchase.order2EventOrders({ order });
    }

}
