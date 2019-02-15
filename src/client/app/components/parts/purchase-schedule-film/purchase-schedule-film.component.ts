import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { IScreeningEventFilm } from '../../../functions';

@Component({
    selector: 'app-purchase-schedule-film',
    templateUrl: './purchase-schedule-film.component.html',
    styleUrls: ['./purchase-schedule-film.component.scss']
})
export class PurchaseScheduleFilmComponent implements OnInit {

    @Input() public screeningFilmEvent: IScreeningEventFilm;
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment: typeof moment = moment;
    constructor() { }

    public ngOnInit() { }

}
