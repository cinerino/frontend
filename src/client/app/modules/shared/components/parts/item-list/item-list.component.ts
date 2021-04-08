import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
    @Input() public reservations?: Models.Purchase.Reservation.IReservation[];
    @Input() public authorizeSeatReservations?: factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>[];
    @Input() public acceptedOffers?: factory.order.IAcceptedOffer<factory.order.IItemOffered>[];
    @Input() public order?: factory.order.IOrder;
    @Input() public code?: string;
    @Output() public openQrcode = new EventEmitter<{ id: string }>();
    public environment = getEnvironment();
    public isShowQRCode = Functions.Order.isShowQRCode;
    public createQRCode = Functions.Order.createQRCode;


    constructor() { }

    public ngOnInit() {
    }

    /**
     * 一時予約から価格取得
     */
    public getReservationPriceComponents(reservation: Models.Purchase.Reservation.IReservation) {
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
        const priceComponents: {
            name: { ja?: string; en?: string; };
            price: number;
            priceCurrency: factory.chevre.priceCurrency;
            referenceQuantity: factory.chevre.quantitativeValue.IQuantitativeValue<factory.chevre.unitCode>
        }[] = [];
        if (this.reservations !== undefined) {
            this.reservations.forEach(r => {
                this.getReservationPriceComponents(r).forEach((p) => {
                    if (p.name === undefined
                        || typeof p.name === 'string'
                        || p.price === undefined) {
                        return;
                    }
                    priceComponents.push({
                        name: p.name,
                        price: p.price,
                        priceCurrency: p.priceCurrency,
                        referenceQuantity: (<any>p).referenceQuantity
                    });
                });
            });
        } else if (this.authorizeSeatReservations !== undefined) {
            this.authorizeSeatReservations.forEach(r => {
                if (r.price === undefined || typeof (r.price) === 'number') {
                    return;
                }
                r.price.priceComponent.forEach(p => {
                    if (p.name === undefined
                        || typeof p.name === 'string'
                        || p.price === undefined) {
                        return;
                    }
                    priceComponents.push({
                        name: p.name,
                        price: p.price,
                        priceCurrency: p.priceCurrency,
                        referenceQuantity: (<any>p).referenceQuantity
                    });
                });
            });
        } else if (this.acceptedOffers !== undefined) {
            this.acceptedOffers.forEach(o => {
                if (o.priceSpecification === undefined) {
                    return;
                }
                (<any>o.priceSpecification).priceComponent.forEach((p: any) => {
                    if (p.name === undefined
                        || typeof p.name === 'string'
                        || p.price === undefined) {
                        return;
                    }
                    priceComponents.push({
                        name: p.name,
                        price: p.price,
                        priceCurrency: p.priceCurrency,
                        referenceQuantity: (<any>p).referenceQuantity
                    });
                });
            });
        }
        const result: {
            priceComponent: {
                name: { ja?: string; en?: string; };
                price: number;
                priceCurrency: factory.chevre.priceCurrency;
                referenceQuantity: factory.chevre.quantitativeValue.IQuantitativeValue<factory.chevre.unitCode>
            };
            count: number;
        }[] = [];
        priceComponents.forEach(p => {
            const findResult = result.find(r => JSON.stringify(r.priceComponent) === JSON.stringify(p));
            if (findResult === undefined) {
                result.push({ priceComponent: p, count: 1 });
                return;
            }
            findResult.count++;
        });
        return result;
    }

}
