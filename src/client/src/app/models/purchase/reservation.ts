import { factory } from '@cinerino/api-javascript-client';
import { IMovieTicket } from '@cinerino/factory/lib/factory/paymentMethod/paymentCard/movieTicket';

/**
 * Reservation
 */
export class Reservation {
    public seat: IReservationSeat;
    public ticket?: IReservationTicket;

    constructor(args: { seat: IReservationSeat, ticket?: IReservationTicket }) {
        this.seat = args.seat;
        this.ticket = args.ticket;
    }

    /**
     * ムビチケ判定
     */
    public isMovieTicket() {
        if (this.ticket === undefined) {
            return false;
        }
        const movieTicketTypeChargeSpecification = this.ticket.ticketOffer.priceSpecification.priceComponent.find(
            (component) => component.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
        );

        return (movieTicketTypeChargeSpecification !== undefined);
    }

    /**
     * 券種金額取得
     */
    public getTicketPrice() {
        if (this.ticket === undefined) {
            return {
                unitPriceSpecification: 0,
                videoFormatCharge: 0,
                soundFormatCharge: 0,
                total: 0
            };
        }
        const unitPriceSpecification = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .shift();
        const soundFormatCharge = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .shift();
        const movieTicketTypeCharge = this.ticket.ticketOffer.priceSpecification.priceComponent
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
export interface IReservationTicket {
    ticketOffer: factory.chevre.event.screeningEvent.ITicketOffer;
    movieTicket?: IMovieTicket;
}
