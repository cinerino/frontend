import { factory } from '@cinerino/api-javascript-client';

/**
 * IReservation
 */
export interface IReservation {
    seat: IReservationSeat;
    ticket?: IReservationTicket;
}

/**
 * IReservationSeat
 */
export interface IReservationSeat {
    seatNumber: string;
    seatSection: string;
}

/**
 * IReservationTicket
 */
export type IReservationTicket = factory.chevre.ticketType.ITicketType;
