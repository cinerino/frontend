import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { changeTicketCount, getAmount, getTicketPrice } from '../../../../../functions';
import { PurchaseService, UserService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-confirm',
    templateUrl: './purchase-confirm.component.html',
    styleUrls: ['./purchase-confirm.component.scss']
})
export class PurchaseConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public changeTicketCount = changeTicketCount;
    public amount: number;
    public environment = getEnvironment();
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private userService: UserService,
        private purchaseService: PurchaseService,
        private router: Router,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.amount = 0;
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.amount = getAmount(purchase.authorizeSeatReservations);
        }).unsubscribe();
    }

    /**
     * 確定
     */
    public async onSubmit() {
        const purchaseData = await this.purchaseService.getData();
        const userData = await this.userService.getData();
        const language = userData.language;
        try {
            if (purchaseData.pendingMovieTickets.length > 0) {
                await this.purchaseService.authorizeMovieTicket();
            }
        } catch (error) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            if (this.amount > 0) {
                await this.purchaseService.authorizeCreditCard(this.amount);
            }
        } catch (error) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.confirm.alert.authorizeCreditCard')
            });
            this.router.navigate(['/purchase/input']);
            return;
        }
        try {
            await this.purchaseService.endTransaction({ language });
            this.router.navigate(['/purchase/complete']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

}
