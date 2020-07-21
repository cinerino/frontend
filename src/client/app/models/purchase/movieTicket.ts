import { factory } from '@cinerino/sdk';

/**
 * IMovieTicket
 */
export interface IMovieTicket {
    id: string;
    movieTickets: factory.chevre.paymentMethod.paymentCard.movieTicket.IMovieTicket[];
}

