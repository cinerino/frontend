import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-confirm',
    templateUrl: './purchase-confirm.component.html',
    styleUrls: ['./purchase-confirm.component.scss'],
})
export class PurchaseConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment = moment;
    public amount: number;
    public environment = getEnvironment();
    public user: Observable<reducers.IUserState>;
    public profile: factory.person.IProfile;

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private actionService: ActionService,
        private router: Router,
        private translate: TranslateService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            this.purchase = this.store.pipe(select(reducers.getPurchase));
            this.isLoading = this.store.pipe(select(reducers.getLoading));
            this.user = this.store.pipe(select(reducers.getUser));
            this.amount = 0;
            const { transaction, profile, authorizeSeatReservations } =
                await this.actionService.purchase.getData();
            if (transaction === undefined || profile === undefined) {
                throw new Error('transaction or profile undefined');
            }
            this.profile = profile;
            this.amount = Functions.Purchase.getAmount(
                authorizeSeatReservations
            );
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 確定
     */
    public async onSubmit() {
        const { pendingMovieTickets } =
            await this.actionService.purchase.getData();
        const { language } = await this.actionService.user.getData();
        try {
            if (this.amount > 0) {
                await this.actionService.purchase.payment.authorizeCreditCard({
                    amount: this.amount,
                });
            }
        } catch (error) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant(
                    'purchase.confirm.alert.authorizeCreditCard'
                ),
            });
            this.router.navigate(['/purchase/input']);
            return;
        }
        try {
            if (pendingMovieTickets.length > 0) {
                await this.actionService.purchase.payment.authorizeMovieTicket();
            }
        } catch (error) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            await this.actionService.purchase.transaction.confirm({
                language,
            });
            this.router.navigate(['/purchase/complete']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
