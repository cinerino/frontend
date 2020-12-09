import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-order-point-transfer-complete',
    templateUrl: './order-point-transfer-complete.component.html',
    styleUrls: ['./order-point-transfer-complete.component.scss']
})
export class OrderPointTransferCompleteComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private actionService: ActionService,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.actionService.order.delete();
    }
}
