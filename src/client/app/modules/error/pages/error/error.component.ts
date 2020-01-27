import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../environments/environment';
import { PurchaseService, UserService } from '../../../../services';
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
        private purchaseService: PurchaseService,
        private userService: UserService,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.error = this.store.pipe(select(reducers.getError));
        this.purchaseService.delete();
        this.userService.delete();
    }

}
