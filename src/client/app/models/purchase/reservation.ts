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
            total: 0,
            single: 0
        };
        if (this.ticket === undefined) {
            return result;
        }
        const priceComponent = this.ticket.ticketOffer.priceSpecification.priceComponent;
        const priceSpecificationType = factory.chevre.priceSpecificationType;
        const unitPriceSpecifications = priceComponent.filter((s) => s.typeOf === priceSpecificationType.UnitPriceSpecification);
        const videoFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.VideoFormatChargeSpecification);
        const soundFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.SoundFormatChargeSpecification);
        const movieTicketTypeCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.MovieTicketTypeChargeSpecification);

        result.unitPriceSpecification += unitPriceSpecifications[0].price;
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
        const unitPriceSpecification = unitPriceSpecifications[0];
        if (unitPriceSpecification.typeOf === priceSpecificationType.UnitPriceSpecification) {
            const referenceQuantityValue = (unitPriceSpecification.referenceQuantity.value === undefined)
                ? 1
                : unitPriceSpecification.referenceQuantity.value;
            result.single = result.total / referenceQuantityValue;
        }

        return result;
    }

    /**
     * 価格仕様取得
     */
    public getUnitPriceSpecification() {
        if (this.ticket === undefined) {
            return;
        }
        const unitPriceSpecifications = this.ticket.ticketOffer.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification);

        return unitPriceSpecifications[0];
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
