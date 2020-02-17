import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';
import { getEnvironment } from '../../../../../../../../environments/environment';
import { getRemainingSeatLength } from '../../../../../../../functions';
import { IReservation, Performance } from '../../../../../../../models';

type IMovieTicketTypeChargeSpecification =
    factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification>;

@Component({
    selector: 'app-purchase-event-ticket-modal',
    templateUrl: './ticket-modal.component.html',
    styleUrls: ['./ticket-modal.component.scss']
})
export class PurchaseEventTicketModalComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    @Input() public screeningEventOffers: factory.chevre.place.movieTheater.IScreeningRoomSectionOffer[];
    @Input() public screeningEvent: factory.event.screeningEvent.IEvent;
    @Input() public cb: (reservations: IReservation[]) => void;
    public tickets: factory.chevre.event.screeningEvent.ITicketOffer[];
    public values: Number[];
    public selectedTickets: {
        id: string;
        count: number;
        addOn: { id: string; }[];
    }[];
    public moment: typeof moment = moment;
    public getRemainingSeatLength = getRemainingSeatLength;
    public performance: Performance;
    public environment = getEnvironment();

    constructor(
        public modal: BsModalRef
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.performance = new Performance(this.screeningEvent);
        this.tickets = [];
        this.tickets = this.screeningEventTicketOffers.filter((ticketOffer) => {
            const movieTicketTypeChargeSpecification =
                <IMovieTicketTypeChargeSpecification>ticketOffer.priceSpecification.priceComponent.find(
                    (c) => c.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
                );
            return movieTicketTypeChargeSpecification === undefined;
        });
        this.values = [];
        let limit = Number(this.environment.PURCHASE_ITEM_MAX_LENGTH);
        if (new Performance(this.screeningEvent).isTicketedSeat()) {
            const remainingSeatLength = this.getRemainingSeatLength(this.screeningEventOffers, this.screeningEvent);
            limit = (limit > remainingSeatLength) ? remainingSeatLength : limit;
        }
        for (let i = 0; i < limit; i++) {
            this.values.push(i + 1);
        }
        const selectedTickets: {
            id: string;
            count: number;
            addOn: { id: string; }[];
        }[] = [];
        this.tickets.forEach((ticket) => {
            selectedTickets.push({
                id: ticket.id,
                count: 0,
                addOn: []
            });
        });
        this.selectedTickets = selectedTickets;
    }

    /**
     * 閉じる
     */
    public close() {
        this.modal.hide();
        const reservations = this.createReservations();
        this.cb(reservations);
    }

    /**
     * 予約チケット作成
     */
    public createReservations() {
        const reservations: IReservation[] = [];
        this.selectedTickets.forEach((t) => {
            const count = t.count;
            for (let i = 0; i < count; i++) {
                const findResult = this.screeningEventTicketOffers.find(s => s.id === t.id);
                const addOn: factory.chevre.offer.IOffer[] = [];
                if (findResult === undefined) {
                    break;
                }
                t.addOn.forEach(a => {
                    if (findResult.addOn === undefined) {
                        return;
                    }
                    const findAddOnResult = findResult.addOn.find(a2 => a2.id === a.id);
                    if (findAddOnResult === undefined) {
                        return;
                    }
                    addOn.push(findAddOnResult);
                });

                reservations.push({
                    ticket: { ticketOffer: findResult, addOn }
                });
            }
        });

        return reservations;
    }

    /**
     * 券種数量変更
     */
    public changeSelect(id: string, event: Event) {
        if (event.target === null) {
            return;
        }
        const element = <HTMLSelectElement>event.target;
        const value = Number(element.value);
        const findResult = this.selectedTickets.find(s => s.id === id);
        if (findResult === undefined) {
            return;
        }
        findResult.count = value;
    }

    /**
     * 券種アドオン変更
     */
    public changeAddOn(id: string, addOnId: string) {
        const findResult = this.selectedTickets.find(s => s.id === id);
        if (findResult === undefined) {
            return;
        }
        const findAddOnResult = findResult.addOn.find(a => a.id === addOnId);
        if (findAddOnResult === undefined) {
            findResult.addOn.push({ id: addOnId });
            return;
        }
        findResult.addOn = findResult.addOn.filter(a => a.id !== addOnId);
    }

}
