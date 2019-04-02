import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { purchaseAction, userAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.error = this.store.pipe(select(reducers.getError));
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new userAction.Delete());
    }

}
