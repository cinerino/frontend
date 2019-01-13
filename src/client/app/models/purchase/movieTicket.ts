import { factory } from '@cinerino/api-javascript-client';

/**
 * IMovieTicket
 */
export interface IMovieTicket {
    id: string;
    movieTickets: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket[];
}
