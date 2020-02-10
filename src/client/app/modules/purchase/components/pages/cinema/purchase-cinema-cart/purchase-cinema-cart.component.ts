import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import { PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-cart',
    templateUrl: './purchase-cinema-cart.component.html',
    styleUrls: ['./purchase-cinema-cart.component.scss']
})
export class PurchaseCinemaCartComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public moment: typeof moment = moment;
    public environment = getEnvironment();

    constructor(
        private purchaseService: PurchaseService,
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchaseService.unsettledDelete();
    }

    /**
     * 仮予約削除確認
     * @param authorizeSeatReservation
     */
    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('purchase.cinema.cart.confirm.cancel'),
            cb: () => {
                const authorizeSeatReservations = [authorizeSeatReservation];
                this.purchaseService.cancelTemporaryReservations(authorizeSeatReservations).catch(() => {
                    this.router.navigate(['/error']);
                });
            }
        });
    }

}
