import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { IMovieTicket } from '@cinerino/factory/lib/factory/paymentMethod/paymentCard/movieTicket';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IReservationTicket, Reservation } from '../../../models';

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
    public tickets: IReservationTicket[];

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
        this.tickets = [];
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
            const movieTickets: IMovieTicket[] = [];
            this.checkMovieTicketActions.forEach((checkMovieTicketAction) => {
                if (checkMovieTicketAction.result === undefined) {
                    return;
                }
                checkMovieTicketAction.result.movieTickets.forEach((movieTicket) => {
                    if (movieTicket.serviceType === movieTicketTypeChargeSpecification.appliesToMovieTicketType) {
                        movieTickets.push(movieTicket);
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

            movieTickets.forEach((movieTicket, index) => {
                if (index >= (movieTickets.length - reservations.length)) {
                    return;
                }
                this.tickets.push({ ticketOffer, movieTicket });
            });
        });
    }

    /**
     * 券種金額取得
     */
    public getTicketPrice(ticket: factory.chevre.event.screeningEvent.ITicketOffer) {
        const unitPriceSpecification = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .shift();
        const soundFormatCharge = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .shift();
        const movieTicketTypeCharge = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification)
            .shift();
        const price = {
            unitPriceSpecification: (unitPriceSpecification === undefined) ? 0 : unitPriceSpecification.price,
            videoFormatCharge: (videoFormatCharge === undefined) ? 0 : videoFormatCharge.price,
            soundFormatCharge: (soundFormatCharge === undefined) ? 0 : soundFormatCharge.price,
            movieTicketTypeCharge: (movieTicketTypeCharge === undefined) ? 0 : movieTicketTypeCharge.price,
            total: 0
        };

        price.total = price.unitPriceSpecification + price.videoFormatCharge + price.soundFormatCharge + price.movieTicketTypeCharge;

        return price;
    }

}
