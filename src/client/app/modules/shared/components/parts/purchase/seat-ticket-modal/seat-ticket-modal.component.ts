import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { isEligibleSeatingType } from '../../../../../../functions';
import { IMovieTicket, IReservation, IReservationTicket } from '../../../../../../models';

type IMovieTicketTypeChargeSpecification =
    factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification>;

@Component({
    selector: 'app-purchase-seat-ticket-modal',
    templateUrl: './seat-ticket-modal.component.html',
    styleUrls: ['./seat-ticket-modal.component.scss']
})
export class PurchaseSeatTicketModalComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    @Input() public checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    @Input() public reservations: IReservation[];
    @Input() public reservation?: IReservation;
    @Input() public pendingMovieTickets: IMovieTicket[];
    @Input() public cb: (ticket: IReservationTicket) => void;
    public tickets: IReservationTicket[];
    public selectedTicket?: IReservationTicket;
    public addOnList: string[];

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.tickets = [];
        this.addOnList = [];
        const movieTickets: IReservationTicket[] = [];
        this.screeningEventTicketOffers.forEach((ticketOffer) => {
            const movieTicketTypeChargeSpecification =
                <IMovieTicketTypeChargeSpecification>ticketOffer.priceSpecification.priceComponent
                    .filter((c) => c.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification)
                    .shift();
            if (movieTicketTypeChargeSpecification === undefined
                && ticketOffer.eligibleSeatingType !== undefined) {
                // 券種の適用座席タイプ条件あり（ムビチケ以外）
                if (this.reservation !== undefined
                    && this.reservation.seat !== undefined
                    && isEligibleSeatingType({ seat: this.reservation.seat, eligibleSeatingType: ticketOffer.eligibleSeatingType })) {
                    this.tickets.push({ ticketOffer });
                }
                return;
            }
            if (movieTicketTypeChargeSpecification === undefined) {
                // 通常券種（ムビチケ以外）
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

    public close(ticket: IReservationTicket) {
        this.modal.hide();
        this.cb(ticket);
    }

    /**
     * 券種選択
     */
    public selsctTicket(ticket: IReservationTicket) {
        if (ticket.ticketOffer.addOn === undefined
            || ticket.ticketOffer.addOn.length === 0) {
            this.close(ticket);
            return;
        }
        this.selectedTicket = ticket;
    }

    /**
     * オプション確定
     */
    public selsctOption() {
        if (this.selectedTicket === undefined) {
            this.modal.hide();
            return;
        }
        const addOn: factory.chevre.offer.IOffer[] = [];
        this.addOnList.forEach(id => {
            if (this.selectedTicket === undefined
                || this.selectedTicket.ticketOffer.addOn === undefined) {
                return;
            }
            const findResult = this.selectedTicket.ticketOffer.addOn.find(a => a.id === id);
            if (findResult === undefined) {
                return;
            }
            addOn.push(findResult);
        });
        this.selectedTicket.addOn = addOn;
        this.close(this.selectedTicket);
    }

    /**
     * オプション選択
     */
    public changeAddOnList(id: string) {
        const findResult = this.addOnList.find(a => a === id);
        if (findResult === undefined) {
            this.addOnList.push(id);
            return;
        }
        this.addOnList = this.addOnList.filter(a => a !== id);
    }

}
