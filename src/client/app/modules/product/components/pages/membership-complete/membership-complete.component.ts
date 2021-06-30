import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, MasterService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-membership-complete',
    templateUrl: './membership-complete.component.html',
    styleUrls: ['./membership-complete.component.scss'],
})
export class MembershipCompleteComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment: typeof moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();
    public paymentTypes: factory.chevre.categoryCode.ICategoryCode[];

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
        private masterService: MasterService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.eventOrders = [];
            this.paymentTypes = [];
            this.purchase = this.store.pipe(select(reducers.getPurchase));
            const { order } = await this.actionService.purchase.getData();
            if (order === undefined) {
                throw new Error('order undefined');
            }
            this.paymentTypes = await this.masterService.searchCategoryCode({
                categorySetIdentifier:
                    factory.chevre.categoryCode.CategorySetIdentifier
                        .PaymentMethodType,
            });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
