import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-item-event',
    templateUrl: './item-event.component.html',
    styleUrls: ['./item-event.component.scss']
})
export class ItemEventComponent implements OnInit {
    @Input() public screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    public environment = getEnvironment();
    public moment = moment;

    constructor() { }

    public ngOnInit() {
    }

}
