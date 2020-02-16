import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { getEnvironment } from '../../../../../../environments/environment';
import { IReservation } from '../../../../../models';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
    @Input() public reservations?: IReservation[];
    @Input() public authorizeSeatReservations?: factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>[];
    @Input() public acceptedOffers?: factory.order.IAcceptedOffer<factory.order.IItemOffered>[];
    public environment = getEnvironment();


    constructor() { }

    public ngOnInit() {
    }

    /**
     * 一時予約から価格取得
     */
    public getReservationPriceComponents(reservation: IReservation) {
        const priceComponents:
            factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[] = [];
        if (reservation.seat !== undefined && reservation.seat.offers !== undefined) {
            // 座席料金
            reservation.seat.offers.forEach((o) => {
                if (o.priceSpecification !== undefined) {
                    o.priceSpecification.priceComponent.forEach(p => priceComponents.push(p));
                }
            });
        }
        if (reservation.ticket !== undefined) {
            // 券種料金
            reservation.ticket.ticketOffer.priceSpecification.priceComponent.forEach(p => priceComponents.push(p));
            if (reservation.ticket.addOn !== undefined) {
                // 券種オプション料金
                reservation.ticket.addOn.forEach(a => {
                    if (a.priceSpecification === undefined) {
                        return;
                    }
                    priceComponents.push(<any>{ ...a.priceSpecification, appliesToAddOn: [] });
                });
            }
        }
        return priceComponents;
    }

    /**
     * 券種情報を枚数別へ変換
     */
    public changeTicketCount() {
        const priceComponentsList:
            factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[][] = [];
        if (this.reservations !== undefined) {
            this.reservations.forEach(r => priceComponentsList.push(this.getReservationPriceComponents(r)));
        } else if (this.authorizeSeatReservations !== undefined) {
            this.authorizeSeatReservations.forEach(r => {
                if (r.price === undefined || typeof (r.price) === 'number') {
                    return;
                }
                priceComponentsList.push(r.price.priceComponent);
            });
        } else if (this.acceptedOffers !== undefined) {
            this.acceptedOffers.forEach(o => {
                if (o.priceSpecification === undefined) {
                    return;
                }
                priceComponentsList.push((<any>o.priceSpecification).priceComponent);
            });
        }
        const result: {
            priceComponents: factory.chevre.event.screeningEvent.ITicketPriceComponent[];
            count: number;
        }[] = [];
        const sortPriceComponent = (p: factory.chevre.event.screeningEvent.ITicketPriceComponent[]) => {
            return p.sort((a, b) => {
                if (a.price < b.price) { return -1; }
                if (a.price > b.price) { return 1; }
                return 0;
            });
        };
        priceComponentsList.forEach((p: factory.chevre.event.screeningEvent.ITicketPriceComponent[]) => {
            const findResult = result.find(r => {
                return (r.priceComponents.length === p.length
                    && JSON.stringify(sortPriceComponent(r.priceComponents)) === JSON.stringify(sortPriceComponent(p)));
            });
            if (findResult === undefined) {
                result.push({ priceComponents: p, count: 1 });
            } else {
                findResult.count += 1;
            }
        });
        return result;
    }

}
