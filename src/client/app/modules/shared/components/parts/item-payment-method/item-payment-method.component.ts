import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-item-payment-method',
    templateUrl: './item-payment-method.component.html',
    styleUrls: ['./item-payment-method.component.scss'],
})
export class ItemPaymentMethodComponent implements OnInit {
    @Input() public paymentMethods: factory.order.IPaymentMethod[];
    @Input() public paymentTypes: factory.chevre.categoryCode.ICategoryCode[];
    public paymentMethodType = factory.paymentMethodType;
    public payments: {
        paymentMethod: factory.order.IPaymentMethod;
        categoryCode: factory.chevre.categoryCode.ICategoryCode;
    }[];
    public environment = getEnvironment();
    public moment = moment;

    constructor() {}

    public ngOnInit() {
        this.payments = [];
        this.paymentMethods.forEach((p) => {
            const categoryCode = this.paymentTypes.find(
                (c) => c.codeValue === p.typeOf
            );
            if (categoryCode === undefined) {
                return;
            }
            this.payments.push({
                paymentMethod: p,
                categoryCode,
            });
        });
    }
}
