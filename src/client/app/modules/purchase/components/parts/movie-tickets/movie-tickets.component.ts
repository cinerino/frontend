import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import * as Models from '../../../../../models';

@Component({
    selector: 'app-movie-tickets',
    templateUrl: './movie-tickets.component.html',
    styleUrls: ['./movie-tickets.component.scss']
})
export class MovieTicketsComponent implements OnInit {

    @Input() public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    @Output() public select = new EventEmitter<factory.paymentMethodType>();
    public isMovieTicket: boolean;
    public isMGTicket: boolean;
    public paymentMethodType = factory.paymentMethodType;
    public moment = moment;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;

    constructor() { }

    public async ngOnInit() {
        const screeningEventTicketOffers = this.screeningEventTicketOffers;
        const movieTicketTypeOffers = Functions.Purchase.getMovieTicketTypeOffers({ screeningEventTicketOffers });
        this.isMovieTicket = (movieTicketTypeOffers.find(m => {
            const findResult = m.priceSpecification.priceComponent.find(
                p => (p.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification
                    && p.appliesToMovieTicket?.serviceOutput?.typeOf === factory.chevre.paymentMethodType.MovieTicket)
            );
            return findResult !== undefined;
        }) !== undefined);
        this.isMGTicket = (movieTicketTypeOffers.find(m => {
            const findResult = m.priceSpecification.priceComponent.find(
                p => (p.typeOf === factory.chevre.priceSpecificationType.UnitPriceSpecification
                    && p.appliesToMovieTicket?.serviceOutput?.typeOf === factory.chevre.paymentMethodType.MGTicket)
            );
            return findResult !== undefined;
        }) !== undefined);
    }

}
