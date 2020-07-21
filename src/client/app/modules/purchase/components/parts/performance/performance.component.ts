import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../environments/environment';
import * as Models from '../../../../../models';

@Component({
    selector: 'app-purchase-performance',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.scss']
})
export class PurchasePerformanceComponent implements OnInit {

    @Input() public performance: Models.Purchase.Performance;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;

    constructor() { }

    public ngOnInit() {
    }

}
