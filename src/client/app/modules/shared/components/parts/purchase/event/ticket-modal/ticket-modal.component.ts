import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';
import { getEnvironment } from '../../../../../../../../environments/environment';
import { getRemainingSeatLength } from '../../../../../../../functions';
import { IReservationTicket, Performance } from '../../../../../../../models';

@Component({
    selector: 'app-purchase-event-ticket-modal',
    templateUrl: './ticket-modal.component.html',
    styleUrls: ['./ticket-modal.component.scss']
})
export class PurchaseEventTicketModalComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    @Input() public screeningEventOffers: factory.chevre.place.movieTheater.IScreeningRoomSectionOffer[];
    @Input() public screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    @Input() public cb: (reservationTickets: IReservationTicket[]) => void;
    public tickets: factory.chevre.event.screeningEvent.ITicketOffer[];
    public values: Number[];
    public selectedTickets: { [key: string]: string; };
    public moment: typeof moment = moment;
    public getRemainingSeatLength = getRemainingSeatLength;
    public environment = getEnvironment();

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        const screeningEvent = this.screeningEvent;
        this.tickets = [];
        this.tickets = this.screeningEventTicketOffers.filter((offer) => {
            const movieTicketTypeChargeSpecification = offer.priceSpecification.priceComponent.find(
                (component) => component.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
            );
            return movieTicketTypeChargeSpecification === undefined;
        });
        this.values = [];
        let limit = (screeningEvent.offers === undefined
            || screeningEvent.offers.eligibleQuantity.maxValue === undefined)
            ? 0 : screeningEvent.offers.eligibleQuantity.maxValue;
        if (new Performance(this.screeningEvent).isTicketedSeat()) {
            const remainingSeatLength = this.getRemainingSeatLength(this.screeningEventOffers, this.screeningEvent);
            limit = (limit > remainingSeatLength) ? remainingSeatLength : limit;
        }
        for (let i = 0; i < limit; i++) {
            this.values.push(i + 1);
        }
        const selectedTickets: { [key: string]: string; } = {};
        this.tickets.forEach((ticket) => {
            selectedTickets[ticket.id] = '0';
        });
        this.selectedTickets = selectedTickets;
    }

    public close() {
        this.modal.hide();
        const reservationTickets = this.createReservationTickets();
        this.cb(reservationTickets);
    }

    public createReservationTickets() {
        const reservationTickets: IReservationTicket[] = [];
        Object.keys(this.selectedTickets).forEach((key) => {
            const value = Number(this.selectedTickets[key]);
            for (let i = 0; i < value; i++) {
                const findResult = this.screeningEventTicketOffers.find(s => s.id === key);
                if (findResult === undefined) {
                    break;
                }
                reservationTickets.push({ ticketOffer: findResult });
            }
        });

        return reservationTickets;
    }

    /**
     * 残席数表示判定
     */
    public isViewRemainingSeatCount() {
        const remainingSeatLength = this.getRemainingSeatLength(this.screeningEventOffers, this.screeningEvent);
        const screeningEvent = this.screeningEvent;
        if (!new Performance(screeningEvent).isTicketedSeat()) {
            return false;
        }
        const unit = this.environment.PURCHASE_VIEW_REMAINING_SEAT_THRESHOLD_UNIT;
        const value = Number(this.environment.PURCHASE_VIEW_REMAINING_SEAT_THRESHOLD_VALUE);
        if (unit === '%') {
            const maximumAttendeeCapacity = screeningEvent.maximumAttendeeCapacity;
            if (maximumAttendeeCapacity === undefined) {
                return false;
            }
            return (Math.floor(remainingSeatLength / maximumAttendeeCapacity * 100) < value);
        } else {
            return (remainingSeatLength < value);
        }
    }

}
