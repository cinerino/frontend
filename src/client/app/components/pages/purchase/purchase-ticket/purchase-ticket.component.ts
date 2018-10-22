import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IReservationTicket, Reservation } from '../../../../models/purchase/reservation';
import { ActionTypes, SelectTicket, TemporaryReservation } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { AlertModalComponent } from '../../../parts/alert-modal/alert-modal.component';
import { MvtkCheckModalComponent } from '../../../parts/mvtk-check-modal/mvtk-check-modal.component';
import { TicketListModalComponent } from '../../../parts/ticket-list-modal/ticket-list-modal.component';

@Component({
    selector: 'app-purchase-ticket',
    templateUrl: './purchase-ticket.component.html',
    styleUrls: ['./purchase-ticket.component.scss']
})
export class PurchaseTicketComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
    }

    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            const reservations = purchase.reservations;
            const authorizeSeatReservation = purchase.authorizeSeatReservation;
            if (transaction === undefined
                || screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const unselectedReservations = reservations.filter((reservation) => {
                return (reservation.ticket === undefined);
            });
            if (unselectedReservations.length > 0) {
                this.openAlert({
                    title: 'エラー',
                    body: '券種が未選択です。'
                });
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
                this.router.navigate(['/purchase/input']);
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

    public openTicketList(reservation: Reservation) {
        const modalRef = this.modal.open(TicketListModalComponent, {
            centered: true
        });
        this.purchase.subscribe((purchase) => {
            modalRef.componentInstance.screeningEventTicketOffers = purchase.screeningEventTicketOffers;
            modalRef.componentInstance.checkMovieTicketActions = purchase.checkMovieTicketActions;
            modalRef.componentInstance.reservations = purchase.reservations;

            modalRef.result.then((ticket: IReservationTicket) => {
                reservation.ticket = ticket;
                this.store.dispatch(new SelectTicket({ reservation }));
            }).catch(() => { });
        }).unsubscribe();
    }

    public openMovieTicket() {
        this.modal.open(MvtkCheckModalComponent, {
            centered: true
        });
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
