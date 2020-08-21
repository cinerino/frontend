import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, CinerinoService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-member-select',
    templateUrl: './purchase-member-select.component.html',
    styleUrls: ['./purchase-member-select.component.scss']
})
export class PurchaseMemberSelectComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment = moment;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
        private cinerinoService: CinerinoService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
    }

    public async nextMember() {
        await this.cinerinoService.signIn({ redirectUrl: '/purchase/member/process' });
    }

    public async nextNonMember() {
        try {
            const purchase = await this.actionService.purchase.getData();
            const transaction = purchase.transaction;
            if (transaction !== undefined) {
                await this.actionService.purchase.cancelTransaction();
            }
            await this.actionService.purchase.startTransaction();
            this.router.navigate(['/purchase/event/ticket']);
        } catch (error) {
            if (error === null) {
                throw new Error('error is null');
            }
            const errorObject = JSON.parse(error);
            if (errorObject.status === TOO_MANY_REQUESTS) {
                this.router.navigate(['/congestion']);
                return;
            }
            if (errorObject.status === BAD_REQUEST) {
                this.router.navigate(['/maintenance']);
                return;
            }
            this.router.navigate(['/error']);
        }
    }

}
