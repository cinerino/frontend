import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { getAmount, getTicketPrice } from '../../../../functions';
import { UtilService } from '../../../../services';
import { purchaseAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

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
    public amount: number;
    public environment = environment;
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private util: UtilService,
        private router: Router,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.user = this.store.pipe(select(reducers.getUser));
        this.amount = 0;
        this.purchase.subscribe((purchase) => {
            this.amount = getAmount(purchase.authorizeSeatReservations);
        }).unsubscribe();
    }

    /**
     * 確定
     */
    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            if (purchase.pendingMovieTickets.length > 0) {
                this.authorizeMovieTicket();
            } else if (this.amount > 0) {
                this.authorizeCreditCard();
            } else {
                this.reserve();
            }
        }).unsubscribe();
    }

    /**
     * 予約
     */
    private reserve() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined || purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            const seller = purchase.seller;
            this.store.dispatch(new purchaseAction.Reserve({ transaction, authorizeSeatReservations, seller }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.ReserveSuccess),
            tap(() => {
                this.router.navigate(['/purchase/complete']);
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.ReserveFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * クレジットカード認証
     */
    private authorizeCreditCard() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.creditCard === undefined) {
                this.router.navigate(['/error']);
                return;
            }

            this.store.dispatch(new purchaseAction.AuthorizeCreditCard({
                transaction: purchase.transaction,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayments[0],
                orderCount: purchase.orderCount,
                amount: this.amount,
                method: '1',
                creditCard: purchase.creditCard
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.AuthorizeCreditCardSuccess),
            tap(() => {
                this.reserve();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.AuthorizeCreditCardFail),
            tap(() => {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.confirm.alert.authorizeCreditCard')
                });
                this.router.navigate(['/purchase/input']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * ムビチケ認証
     */
    private authorizeMovieTicket() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.AuthorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayments: purchase.authorizeMovieTicketPayments,
                authorizeSeatReservations: purchase.authorizeSeatReservations,
                pendingMovieTickets: purchase.pendingMovieTickets
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.AuthorizeMovieTicketSuccess),
            tap(() => {
                if (this.amount > 0) {
                    this.authorizeCreditCard();
                } else {
                    this.reserve();
                }
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.AuthorizeMovieTicketFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
