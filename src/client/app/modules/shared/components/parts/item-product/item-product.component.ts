import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-item-product',
    templateUrl: './item-product.component.html',
    styleUrls: ['./item-product.component.scss'],
})
export class ItemProductComponent implements OnInit {
    @Input()
    public authorizeProductAction?: factory.action.authorize.offer.product.IAction;
    @Input() public order?: factory.order.IOrder;
    public environment = getEnvironment();
    public unitCode = factory.unitCode;

    constructor() {}

    public ngOnInit() {}
}
