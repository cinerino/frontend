import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { IReservationSeat, Reservation, SeatStatus } from '../../../../models';
import {
    ActionTypes,
    CancelSeats,
    GetScreen,
    GetTicketList,
    SelectSeats,
    TemporaryReservation
} from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { AlertModalComponent } from '../../../parts/alert-modal/alert-modal.component';

@Component({
    selector: 'app-purchase-seat',
    templateUrl: './purchase-seat.component.html',
    styleUrls: ['./purchase-seat.component.scss']
})
export class PurchaseSeatComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal
    ) { }

    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.getScreen();
    }

    /**
     * getScreen
     */
    private getScreen() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            if (screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new GetScreen({ screeningEvent }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.GetScreenSuccess),
            tap(() => {
                this.getTickets();
             })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetScreenFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * selectSeat
     */
    public selectSeat(data: {
        seat: IReservationSeat,
        status: SeatStatus
    }) {
        if (data.status === SeatStatus.Default) {
            this.store.dispatch(new SelectSeats({ seats: [data.seat] }));
        } else {
            this.store.dispatch(new CancelSeats({ seats: [data.seat] }));
        }
    }

    /**
     * onSubmit
     */
    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            if (purchase.reservations.length === 0) {
                this.openAlert({
                    title: 'エラー',
                    body: '座席が未選択です。'
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
            this.store.dispatch(new TemporaryReservation({
                transaction,
                screeningEvent,
                reservations,
                authorizeSeatReservation
            }));
        }).unsubscribe();
        const success = this.actions.pipe(
            ofType(ActionTypes.TemporaryReservationSuccess),
            tap(() => {
                this.router.navigate(['/purchase/ticket']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.TemporaryReservationFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * getTickets
     */
    private getTickets() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            const movieTheater = purchase.movieTheater;
            const clientId = environment.CLIENT_ID_OAUTH2;
            if (screeningEvent === undefined
                || movieTheater === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new GetTicketList({ screeningEvent, movieTheater, clientId }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.GetTicketListSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetTicketListFail),
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
