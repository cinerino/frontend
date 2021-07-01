import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Functions } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import * as Models from '../../../../../models';
import { MembershipCheckModalComponent } from '../../../../shared/components/parts/membership/check-modal/check-modal.component';
import { MovieTicketCheckModalComponent } from '../../../../shared/components/parts/movieticket/check-modal/check-modal.component';

@Component({
    selector: 'app-input-tickets',
    templateUrl: './input-tickets.component.html',
    styleUrls: ['./input-tickets.component.scss'],
})
export class InputTicketsComponent implements OnInit {
    @Input()
    public screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    public isMovieTicket: boolean;
    public isMGTicket: boolean;
    public isMembership: boolean;
    public paymentMethodType = factory.paymentMethodType;
    public moment = moment;
    public environment = getEnvironment();
    public viewType = Models.Common.ViewType;

    constructor(private modal: BsModalService) {}

    public async ngOnInit() {
        const screeningEventTicketOffers = this.screeningEventTicketOffers;
        const movieTicketTypeOffers =
            Functions.Purchase.getMovieTicketTypeOffers({
                screeningEventTicketOffers,
            });
        this.isMovieTicket =
            movieTicketTypeOffers.find((m) => {
                const findResult = m.priceSpecification.priceComponent.find(
                    (p) =>
                        p.typeOf ===
                            factory.chevre.priceSpecificationType
                                .UnitPriceSpecification &&
                        p.appliesToMovieTicket?.serviceOutput?.typeOf ===
                            factory.chevre.paymentMethodType.MovieTicket
                );
                return findResult !== undefined;
            }) !== undefined;
        this.isMGTicket =
            movieTicketTypeOffers.find((m) => {
                const findResult = m.priceSpecification.priceComponent.find(
                    (p) =>
                        p.typeOf ===
                            factory.chevre.priceSpecificationType
                                .UnitPriceSpecification &&
                        p.appliesToMovieTicket?.serviceOutput?.typeOf ===
                            factory.chevre.paymentMethodType.MGTicket
                );
                return findResult !== undefined;
            }) !== undefined;
        this.isMembership =
            Functions.Purchase.getMembershipTypeOffers({
                screeningEventTicketOffers,
            }).length > 0;
    }

    public openMovieTicket(
        paymentMethodType: factory.chevre.paymentMethodType
    ) {
        this.modal.show(MovieTicketCheckModalComponent, {
            initialState: {
                paymentMethodType,
            },
            class: 'modal-dialog-centered',
        });
    }

    public openMembership() {
        this.modal.show(MembershipCheckModalComponent, {
            initialState: {},
            class: 'modal-dialog-centered',
        });
    }
}
