import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { IScreeningEventWork } from '../../../../../../functions';

@Component({
    selector: 'app-purchase-cinema-performances',
    templateUrl: './performances.component.html',
    styleUrls: ['./performances.component.scss']
})
export class PurchaseCinemaPerformancesComponent implements OnInit {

    @Input() public screeningWorkEvent: IScreeningEventWork;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;

    constructor() { }

    public ngOnInit() {
    }

}
