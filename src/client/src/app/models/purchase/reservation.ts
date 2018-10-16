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
        const unitPriceSpecification = this.ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = this.ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .shift();
        const soundFormatCharge = this.ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.SoundFormatChargeSpecification)
            .shift();
        const price = {
            unitPriceSpecification: (unitPriceSpecification === undefined) ? 0 : unitPriceSpecification.price,
            videoFormatCharge: (videoFormatCharge === undefined) ? 0 : videoFormatCharge.price,
            soundFormatCharge: (soundFormatCharge === undefined) ? 0 : soundFormatCharge.price,
            total: 0
        };

        price.total = price.unitPriceSpecification + price.videoFormatCharge + price.soundFormatCharge;

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
export type IReservationTicket = factory.chevre.event.screeningEvent.ITicketOffer;
