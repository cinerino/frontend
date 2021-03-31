import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-purchase-performances',
    templateUrl: './performances.component.html',
    styleUrls: ['./performances.component.scss']
})
export class PurchasePerformancesComponent implements OnInit {

    @Input() public screeningEventsGroup: Functions.Purchase.IScreeningEventsGroup;
    @Input() public creativeWork: factory.chevre.creativeWork.movie.ICreativeWork;
    @Input() public contentRatingTypes: factory.chevre.categoryCode.ICategoryCode[];
    @Output() public select = new EventEmitter<factory.chevre.event.screeningEvent.IEvent>();
    public moment = moment;
    public environment = getEnvironment();

    constructor() { }

    public ngOnInit() {}

    /**
     * レイティング区分取得
     */
     public getContentRatingType(code?: string) {
        return this.contentRatingTypes.find(c => c.codeValue === code);
    }

}
