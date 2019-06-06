import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { IScreeningEventWork, isSales, isScheduleStatusThreshold, isTicketedSeatScreeningEvent } from '../../../../../functions';

@Component({
    selector: 'app-purchase-event-performance-confirm',
    templateUrl: './purchase-event-performance-confirm.component.html',
    styleUrls: ['./purchase-event-performance-confirm.component.scss']
})
export class PurchaseEventPerformanceConfirmComponent implements OnInit {

    @Input() public screeningWorkEvent: IScreeningEventWork;
    @Input() public readonly: boolean;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment: typeof moment = moment;
    public isScheduleStatusThreshold = isScheduleStatusThreshold;
    public isSales = isSales;
    public isTicketedSeatScreeningEvent = isTicketedSeatScreeningEvent;

    constructor() { }

    public ngOnInit() { }

}
