import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
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
    @Input() public qrcode = false;
    @Input() public order?: factory.order.IOrder;
    @Output() public openQrcode = new EventEmitter<{ id: string }>();
    public environment = getEnvironment();
    public isShowQRCode = Functions.Order.isShowQRCode;


    constructor() { }

    public ngOnInit() {
    }

    public createQRCode(
        acceptedOffer: factory.order.IAcceptedOffer<factory.order.IItemOffered>,
        order: factory.order.IOrder,
        index: number
    ) {
        let qrcode;
        const itemOffered = <factory.chevre.reservation.IReservation<
            factory.chevre.reservationType.EventReservation
        >>acceptedOffer.itemOffered;
        const environment = this.environment;
        if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.None) {
            // なし
            qrcode = undefined;
        } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Token) {
            // トークン
            qrcode = itemOffered.reservedTicket.ticketToken;
        } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Admission) {
            // 入場
            qrcode = JSON.stringify({
                orderNumber: order.orderNumber,
                reservationNumber: itemOffered.reservationNumber,
                id: itemOffered.id
            });
        } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Custom) {
            // カスタム文字列
            qrcode = environment.PRINT_QRCODE_CUSTOM;
            qrcode = qrcode
                .replace(/\{\{ orderDate \| YYMMDD \}\}/g, moment(order.orderDate).format('YYMMDD'));
            qrcode = qrcode
                .replace(/\{\{ confirmationNumber \}\}/g, order.confirmationNumber);
            qrcode = qrcode
                .replace(/\{\{ confirmationNumber \| [0-9] \}\}/g, (match) => {
                    const digit = Number(match.replace(/\{\{ confirmationNumber \| ([0-9]) \}\}/, '$1'));
                    return `000000000${order.confirmationNumber}`.slice(-1 * digit);
                });
            qrcode = qrcode
                .replace(/\{\{ index \}\}/g, String(index));
            qrcode = qrcode
                .replace(/\{\{ index \| [0-9] \}\}/g, (match) => {
                    const digit = Number(match.replace(/\{\{ index \| ([0-9]) \}\}/, '$1'));
                    return `000000000${String(index)}`.slice(-1 * digit);
                });
            qrcode = qrcode
                .replace(/\{\{ orderNumber \}\}/g, order.orderNumber);
            qrcode = qrcode
                .replace(
                    /\{\{ startDate \| YYMMDD \}\}/g,
                    moment(itemOffered.reservationFor.startDate).format('YYMMDD')
                );
        }
        const additionalProperty = (itemOffered.reservationFor.workPerformed !== undefined
            && itemOffered.reservationFor.workPerformed.additionalProperty !== undefined
            && itemOffered.reservationFor.workPerformed.additionalProperty.length > 0)
            ? itemOffered.reservationFor.workPerformed.additionalProperty :
            (itemOffered.additionalProperty !== undefined
                && itemOffered.additionalProperty.length > 0) ?
                itemOffered.additionalProperty
                : undefined;
        if (additionalProperty !== undefined) {
            // 追加特性のqrcodeがfalseの場合QR非表示
            const isDisplayQrcode = additionalProperty.find(a => a.name === 'qrcode');
            if (isDisplayQrcode !== undefined && isDisplayQrcode.value === 'false') {
                qrcode = undefined;
            }
        }
        return qrcode;
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
                        if (o.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                            return;
                        }
                        const itemOffered = <factory.chevre.reservation.IReservation<
                            factory.chevre.reservationType.EventReservation
                        >>o.itemOffered;
                        if (p.name === undefined
                            && itemOffered.typeOf === factory.chevre.reservationType.EventReservation) {
                            p.name = itemOffered.reservedTicket.ticketType.name;
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
