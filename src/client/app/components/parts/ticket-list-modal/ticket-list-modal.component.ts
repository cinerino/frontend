import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getTicketPrice } from '../../../functions';
import { IMovieTicket, IReservationTicket, Reservation } from '../../../models';

type IMovieTicketTypeChargeSpecification =
    factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification>;

@Component({
    selector: 'app-ticket-list-modal',
    templateUrl: './ticket-list-modal.component.html',
    styleUrls: ['./ticket-list-modal.component.scss']
})
export class TicketListModalComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    @Input() public checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    @Input() public reservations: Reservation[];
    @Input() public pendingMovieTickets: IMovieTicket[];
    public tickets: IReservationTicket[];
    public getTicketPrice = getTicketPrice;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
        this.tickets = [];
        const movieTickets: IReservationTicket[] = [];
        this.screeningEventTicketOffers.forEach((ticketOffer) => {
            const movieTicketTypeChargeSpecification = <IMovieTicketTypeChargeSpecification>ticketOffer.priceSpecification.priceComponent
                .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification)
                .shift();
            if (movieTicketTypeChargeSpecification === undefined) {
                // ムビチケ以外
                this.tickets.push({ ticketOffer });
                return;
            }

            // 対象ムビチケ券
            const targetMovieTickets: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket[] = [];
            this.checkMovieTicketActions.forEach((checkMovieTicketAction) => {
                if (checkMovieTicketAction.result === undefined) {
                    return;
                }
                const availabilityMovieTickets = checkMovieTicketAction.result.movieTickets.filter((movieTicket) => {
                    return (movieTicket.validThrough === undefined);
                });
                availabilityMovieTickets.forEach((movieTicket) => {
                    if (movieTicket.serviceType === movieTicketTypeChargeSpecification.appliesToMovieTicketType) {
                        targetMovieTickets.push(movieTicket);
                    }
                });
            });

            // 選択中の対象ムビチケ券
            const reservations = this.reservations.filter((reservation) => {
                if (reservation.ticket === undefined
                    || reservation.ticket.movieTicket === undefined) {
                    return false;
                }
                return (movieTicketTypeChargeSpecification.appliesToMovieTicketType
                    === reservation.ticket.movieTicket.serviceType);
            });

            // 予約待ちのムビチケ券
            const pendingMovieTickets: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket[] = [];
            this.pendingMovieTickets.forEach((pendingMovieTicket) => {
                pendingMovieTicket.movieTickets.forEach((movieTicket) => {
                    pendingMovieTickets.push(movieTicket);
                });
            });

            targetMovieTickets.forEach((movieTicket) => {
                const reservationsIndex = reservations.findIndex((reservation) => {
                    return (reservation.ticket !== undefined
                        && reservation.ticket.movieTicket !== undefined
                        && reservation.ticket.movieTicket.identifier === movieTicket.identifier);
                });
                if (reservationsIndex > -1) {
                    reservations.splice(reservationsIndex, 1);
                    return;
                }
                const pendingMovieTicketsIndex = pendingMovieTickets.findIndex((pendingMovieTicket) => {
                    return (pendingMovieTicket.identifier === movieTicket.identifier);
                });
                if (pendingMovieTicketsIndex > -1) {
                    pendingMovieTickets.splice(pendingMovieTicketsIndex, 1);
                    return;
                }
                movieTickets.push({ ticketOffer, movieTicket });
            });
        });

        this.tickets = movieTickets.concat(this.tickets);
    }

}
