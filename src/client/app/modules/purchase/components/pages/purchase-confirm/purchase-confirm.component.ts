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
    styleUrls: ['./purchase-confirm.component.scss']
})
export class PurchaseConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment: typeof moment = moment;
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
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.amount = 0;
        const purchase = await this.actionService.purchase.getData();
        if (purchase.transaction === undefined
            || purchase.profile === undefined) {
            this.router.navigate(['/error']);
            return;
        }
        this.profile = purchase.profile;
        this.amount = Functions.Purchase.getAmount(purchase.authorizeSeatReservations);
    }

    /**
     * 確定
     */
    public async onSubmit() {
        const purchaseData = await this.actionService.purchase.getData();
        const userData = await this.actionService.user.getData();
        const language = userData.language;
        try {
            if (purchaseData.pendingMovieTickets.length > 0) {
                await this.actionService.purchase.authorizeMovieTicket();
            }
        } catch (error) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            if (this.amount > 0) {
                await this.actionService.purchase.authorizeCreditCard(this.amount);
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
            await this.actionService.purchase.endTransaction({ language });
            this.router.navigate(['/purchase/complete']);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 購入者情報取得
     */
    public getProfile() {
        const profile = this.profile;
        const result: { key: string; name: string; value?: string; label?: { ja: string; en: string; } }[] = [];
        if (profile === undefined) {
            return result;
        }
        this.environment.PROFILE.forEach(p => {
            const key = p.key;
            if (result.find(r => r.name === 'common.customerName') === undefined
                && (key === 'familyName' || key === 'givenName')) {
                result.push({
                    key: 'customerName',
                    name: 'common.customerName',
                    value: (profile.familyName === undefined && profile.givenName === undefined)
                        ? '' : `${profile.familyName} ${profile.givenName}`
                });
                return;
            }
            if (key === 'email'
                || key === 'telephone'
                || key === 'address'
                || key === 'age'
                || key === 'gender') {
                result.push({
                    key,
                    name: `form.label.${key}`,
                    value: profile[key],
                    label: p.label
                });
                return;
            }
            if (!/additionalProperty/.test(key)) {
                return;
            }
            result.push({
                key,
                name: key,
                value: profile.additionalProperty?.find(a => a.name === key.replace('additionalProperty.', ''))?.value,
                label: p.label
            });

        });
        return result.filter(r => r.value !== undefined && r.value !== '');
    }

}
