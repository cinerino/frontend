import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { Performance } from '../../../../../../models';

@Component({
    selector: 'app-purchase-event-performance',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.scss']
})
export class PurchaseEventPerformanceComponent implements OnInit {

    @Input() public performance: Performance;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    constructor() { }

    public ngOnInit() {
    }

}
