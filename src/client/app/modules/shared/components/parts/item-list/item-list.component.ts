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
                    priceComponents.push(a.priceSpecification);
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
                const priceComponents:
                    factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[] = [];
                (<any>o.priceSpecification).priceComponent
                    .forEach((p: factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>) => {
                        if (p.name === undefined) {
                            p.name = o.name;
                        }
                        priceComponents.push(p);
                    });
                priceComponentsList.push(priceComponents);
            });
        }
        const result: {
            priceComponents: factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[];
            count: number;
        }[] = [];
        const sortPriceComponent = (p: factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[]) => {
            return p.sort((a, b) => {
                const priceA = (a.price === undefined) ? 0 : a.price;
                const priceB = (b.price === undefined) ? 0 : b.price;
                if (priceA < priceB) { return -1; }
                if (priceA > priceB) { return 1; }
                return 0;
            });
        };
        priceComponentsList.forEach((p: factory.chevre.priceSpecification.IPriceSpecification<factory.chevre.priceSpecificationType>[]) => {
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
