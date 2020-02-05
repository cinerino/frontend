import { factory } from '@cinerino/api-javascript-client';

export interface IReservation {
    seat: IReservationSeat;
    ticket?: IReservationTicket;
}

/**
 * IReservationSeat
 */
export interface IReservationSeat extends factory.chevre.reservation.ISeat<factory.chevre.reservationType.EventReservation> {
    offers?: factory.chevre.place.seat.IOffer[];
}

/**
 * IReservationTicket
 */
export interface IReservationTicket {
    ticketOffer: factory.chevre.event.screeningEvent.ITicketOffer;
    movieTicket?: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket;
}
