import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getAmount, getTicketPrice } from '../../../../functions';
import { UtilService } from '../../../../services';
import { ActionTypes, AuthorizeCreditCard, AuthorizeMovieTicket, Reserve } from '../../../../store/actions/purchase.action';
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
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private util: UtilService,
        private router: Router,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.amount = 0;
        this.purchase.subscribe((purchase) => {
            this.amount = getAmount(purchase.authorizeSeatReservations);
        }).unsubscribe();
    }

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
     * reserve
     */
    private reserve() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            this.store.dispatch(new Reserve({ transaction }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.ReserveSuccess),
            tap(() => {
                this.router.navigate(['/purchase/complete']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.ReserveFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * authorizeCreditCard
     */
    private authorizeCreditCard() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined
                || purchase.gmoTokenObject === undefined) {
                this.router.navigate(['/error']);
                return;
            }

            this.store.dispatch(new AuthorizeCreditCard({
                transaction: purchase.transaction,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayments[0],
                orderCount: purchase.orderCount,
                amount: this.amount,
                method: '1',
                gmoTokenObject: purchase.gmoTokenObject
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.AuthorizeCreditCardSuccess),
            tap(() => {
                this.reserve();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.AuthorizeCreditCardFail),
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
     * authorizeMovieTicket
     */
    private authorizeMovieTicket() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new AuthorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayments: purchase.authorizeMovieTicketPayments,
                authorizeSeatReservations: purchase.authorizeSeatReservations,
                pendingMovieTickets: purchase.pendingMovieTickets
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.AuthorizeMovieTicketSuccess),
            tap(() => {
                if (this.amount > 0) {
                    this.authorizeCreditCard();
                } else {
                    this.reserve();
                }
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.AuthorizeMovieTicketFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
