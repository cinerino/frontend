import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as purchaseAction from '../../../store/actions/purchase.action';
import * as userAction from '../../../store/actions/user.action';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-expired',
    templateUrl: './expired.component.html',
    styleUrls: ['./expired.component.scss']
})
export class ExpiredComponent implements OnInit {

    constructor(
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new userAction.Delete());
    }

}
