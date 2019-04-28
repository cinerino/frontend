import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IReservationSeat, Reservation, SeatStatus } from '../../../../../models';
import { UtilService } from '../../../../../services';
import { purchaseAction } from '../../../../../store/actions';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-seat',
    templateUrl: './purchase-cinema-seat.component.html',
    styleUrls: ['./purchase-cinema-seat.component.scss']
})
export class PurchaseCinemaSeatComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private util: UtilService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.getScreen();
    }

    /**
     * スクリーン情報取得
     */
    private getScreen() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            if (screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.GetScreen({ screeningEvent }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetScreenSuccess),
            tap(() => {
                this.getTickets();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetScreenFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 座席選択
     */
    public selectSeat(data: {
        seat: IReservationSeat,
        status: SeatStatus
    }) {
        if (data.status === SeatStatus.Default) {
            this.store.dispatch(new purchaseAction.SelectSeats({ seats: [data.seat] }));
        } else {
            this.store.dispatch(new purchaseAction.CancelSeats({ seats: [data.seat] }));
        }
    }

    /**
     * 座席決定
     */
    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            if (purchase.reservations.length === 0) {
                this.util.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.cinema.seat.alert.unselected')
                });
                return;
            }
            const reservations = purchase.reservations.map((reservation) => {
                return new Reservation({
                    seat: reservation.seat,
                    ticket: (reservation.ticket === undefined)
                        ? { ticketOffer: purchase.screeningEventTicketOffers[0] }
                        : reservation.ticket
                });
            });
            const authorizeSeatReservation = purchase.authorizeSeatReservation;
            if (transaction === undefined
                || screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.TemporaryReservation({
                transaction,
                screeningEvent,
                reservations,
                authorizeSeatReservation
            }));
        }).unsubscribe();
        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.TemporaryReservationSuccess),
            tap(() => {
                this.router.navigate(['/purchase/cinema/ticket']);
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.TemporaryReservationFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * 券種情報取得
     */
    private getTickets() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            const seller = purchase.seller;
            if (screeningEvent === undefined
                || seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new purchaseAction.GetTicketList({ screeningEvent, seller }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetTicketListSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetTicketListFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
