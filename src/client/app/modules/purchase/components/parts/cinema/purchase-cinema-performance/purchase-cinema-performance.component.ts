import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../../environments/environment';
import { IScreeningEventWork } from '../../../../../../functions';

@Component({
    selector: 'app-purchase-cinema-performance',
    templateUrl: './purchase-cinema-performance.component.html',
    styleUrls: ['./purchase-cinema-performance.component.scss']
})
export class PurchaseCinemaPerformanceComponent implements OnInit {

    @Input() public screeningWorkEvent: IScreeningEventWork;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment: typeof moment = moment;
    public environment = getEnvironment();

    constructor() { }

    public ngOnInit() {
    }

}
