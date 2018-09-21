import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-complete',
    templateUrl: './purchase-complete.component.html',
    styleUrls: ['./purchase-complete.component.scss']
})
export class PurchaseCompleteComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public startDate: string;

    constructor(
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.purchase.subscribe((purchase) => {
            this.startDate = (purchase.screeningEvent === undefined)
                ? ''
                : moment(purchase.screeningEvent.startDate).format('YYYY/MM/DD (ddd) HH:mm');
        }).unsubscribe();
    }

}
