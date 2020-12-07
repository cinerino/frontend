import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../environments/environment';
import { ActionService } from '../../../../services';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
    public error: Observable<string | null>;
    public environment = getEnvironment();
    constructor(
        private actionService: ActionService,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.error = this.store.pipe(select(reducers.getError));
        try {
            await this.actionService.purchase.cancelTransaction();
        } catch (error) {
            console.error(error);
        }
        this.actionService.purchase.delete();
        this.actionService.user.delete();
    }

}
