import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-membership-confirm',
    templateUrl: './membership-confirm.component.html',
    styleUrls: ['./membership-confirm.component.scss'],
})
export class MembershipConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment = moment;
    public amount: number;
    public environment = getEnvironment();
    public user: Observable<reducers.IUserState>;

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
            const { authorizeProducts } =
                await this.actionService.purchase.getData();
            this.amount = 0;
            authorizeProducts.forEach((a) => {
                if (a.result?.price === undefined) {
                    return;
                }
                this.amount += a.result?.price;
            });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 確定
     */
    public async onSubmit() {
        const { language } = await this.actionService.user.getData();
        console.log('this.amount', this.amount);
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
            this.router.navigate(['/product/membership/input']);
            return;
        }
        try {
            await this.actionService.purchase.transaction.confirm({
                mailType: 'product',
                language,
            });
            this.router.navigate(['/product/membership/complete']);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }
}
