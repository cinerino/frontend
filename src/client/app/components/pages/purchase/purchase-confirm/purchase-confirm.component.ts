import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getAmount, getTicketPrice } from '../../../../functions';
import { ActionTypes, AuthorizeCreditCard, AuthorizeMovieTicket, Reserve } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { AlertModalComponent } from '../../../parts/alert-modal/alert-modal.component';

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
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private modal: NgbModal,
        private router: Router
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
    }

    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            const movieTickets = purchase.reservations.filter(reservation => reservation.isMovieTicket());
            if (movieTickets.length > 0) {
                this.authorizeMovieTicket();
            } else if (purchase.authorizeSeatReservation !== undefined
                && purchase.authorizeSeatReservation.result !== undefined
                && purchase.authorizeSeatReservation.result.price > 0) {
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
                || purchase.movieTheater === undefined
                || purchase.gmoTokenObject === undefined) {
                this.router.navigate(['/error']);
                return;
            }

            this.store.dispatch(new AuthorizeCreditCard({
                transaction: purchase.transaction,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayments[0],
                orderCount: purchase.orderCount,
                amount: getAmount(purchase.authorizeSeatReservations),
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
                this.openAlert({
                    title: 'エラー',
                    body: 'クレジットカード情報を確認してください。'
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
            if (purchase.transaction === undefined
                || purchase.screeningEvent === undefined
                || purchase.authorizeSeatReservation === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new AuthorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayments: purchase.authorizeMovieTicketPayments,
                authorizeSeatReservation: purchase.authorizeSeatReservation,
                reservations: purchase.reservations
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.AuthorizeMovieTicketSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    if (purchase.authorizeSeatReservation !== undefined
                        && purchase.authorizeSeatReservation.result !== undefined
                        && purchase.authorizeSeatReservation.result.price > 0) {
                        this.authorizeCreditCard();
                    } else {
                        this.reserve();
                    }
                }).unsubscribe();
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

    public openAlert(args: {
        title: string;
        body: string;
    }) {
        const modalRef = this.modal.open(AlertModalComponent, {
            centered: true
        });
        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }

}
