import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';

@Component({
    selector: 'app-order-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    @Input() public order: factory.order.IOrder;
    @Input() public code?: string;
    @Input() public customer?: boolean;
    @Input() public confirmationNumber?: boolean;
    public moment = moment;
    public eventOrders: Functions.Purchase.IEventOrder[];
    public environment = getEnvironment();

    constructor(
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.customer = (this.customer === undefined) ? true : this.customer;
        this.confirmationNumber = (this.confirmationNumber === undefined) ? true : this.confirmationNumber;
        this.eventOrders = [];
        this.eventOrders = Functions.Purchase.order2EventOrders({ order: this.order });
    }

}
