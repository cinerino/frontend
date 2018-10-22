import { factory } from '@cinerino/api-javascript-client';

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

        return (this.ticket.movieTicket !== undefined);
    }

    /**
     * 券種金額取得
     */
    public getTicketPrice() {
        const result = {
            unitPriceSpecification: 0,
            videoFormatCharge: 0,
            soundFormatCharge: 0,
            movieTicketTypeCharge: 0,
            total: 0
        };
        if (this.ticket === undefined) {
            return result;
        }
        const unitPriceSpecifications = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification);
        const videoFormatCharges = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.VideoFormatChargeSpecification);
        const soundFormatCharges = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.SoundFormatChargeSpecification);
        const movieTicketTypeCharges = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification);

        unitPriceSpecifications.forEach((unitPriceSpecification) => {
            result.unitPriceSpecification += unitPriceSpecification.price;
        });
        videoFormatCharges.forEach((videoFormatCharge) => {
            result.videoFormatCharge += videoFormatCharge.price;
        });
        soundFormatCharges.forEach((soundFormatCharge) => {
            result.soundFormatCharge += soundFormatCharge.price;
        });
        movieTicketTypeCharges.forEach((movieTicketTypeCharge) => {
            result.movieTicketTypeCharge += movieTicketTypeCharge.price;
        });
        result.total = result.unitPriceSpecification + result.videoFormatCharge + result.soundFormatCharge + result.movieTicketTypeCharge;

        return result;
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
    movieTicket?: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket;
}
