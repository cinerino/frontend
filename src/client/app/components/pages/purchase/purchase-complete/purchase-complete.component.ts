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
    public moment: typeof moment = moment;

    constructor(
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
    }

}
