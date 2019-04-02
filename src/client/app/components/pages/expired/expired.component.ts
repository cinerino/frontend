import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { purchaseAction, userAction } from '../../../store/actions';
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

    /**
     * 初期化
     */
    public ngOnInit() {
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new userAction.Delete());
    }

}
