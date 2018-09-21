import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-purchase-info',
    templateUrl: './purchase-info.component.html',
    styleUrls: ['./purchase-info.component.scss']
})
export class PurchaseInfoComponent implements OnInit {
    @Input() public purchase: reducers.IPurchaseState;
    public startDate: string;
    constructor() { }

    public ngOnInit() {
        this.startDate = (this.purchase.screeningEvent === undefined)
            ? ''
            : moment(this.purchase.screeningEvent.startDate).format('YYYY/MM/DD (ddd) HH:mm');
    }

}
