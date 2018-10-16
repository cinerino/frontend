import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ticket-list-modal',
    templateUrl: './ticket-list-modal.component.html',
    styleUrls: ['./ticket-list-modal.component.scss']
})
export class TicketListModalComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.ticketType.ITicketType[];

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {}

    /**
     * 券種金額取得
     */
    public getTicketPrice(ticket: factory.chevre.event.screeningEvent.ITicketOffer) {
        const unitPriceSpecification = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = ticket.priceSpecification.priceComponent
            .filter((s) => s.typeOf === factory.chevre.priceSpecificationType.VideoFormatChargeSpecification)
            .shift();
        const soundFormatCharge = ticket.priceSpecification.priceComponent
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
