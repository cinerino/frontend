import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../environments/environment';
import { Performance, ViewType } from '../../../../../models';

@Component({
    selector: 'app-purchase-performance',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.scss']
})
export class PurchasePerformanceComponent implements OnInit {

    @Input() public performance: Performance;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    public environment = getEnvironment();
    public viewType = ViewType;

    constructor() { }

    public ngOnInit() {
    }

}
