import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';

@Component({
    selector: 'app-purchase-event-performances-confirm',
    templateUrl: './performances-confirm.component.html',
    styleUrls: ['./performances-confirm.component.scss']
})
export class PurchaseEventPerformancesConfirmComponent implements OnInit {

    @Input() public screeningEventsGroup: Functions.Purchase.IScreeningEventsGroup;
    @Input() public readonly: boolean;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    public environment = getEnvironment();

    constructor() { }

    public ngOnInit() { }

}
