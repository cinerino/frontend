import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    public theaterCode?: string;

    constructor(
        private store: Store<reducers.IState>,
        private actionService: ActionService,
        private activatedRoute: ActivatedRoute,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.theaterCode = this.activatedRoute.snapshot.params.theaterCode;
        this.actionService.order.delete();
    }
}
