import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';
import * as qrcode from 'qrcode';
import { environment } from '../../../../environments/environment';
import { getTicketPrice } from '../../../functions';

@Component({
    selector: 'app-qrcode-modal',
    templateUrl: './qrcode-modal.component.html',
    styleUrls: ['./qrcode-modal.component.scss']
})
export class QrCodeModalComponent implements OnInit {
    @Input() public order: factory.order.IOrder;
    public moment: typeof moment = moment;
    public urlList: Promise<string>[];
    public getTicketPrice = getTicketPrice;
    public environment = environment;
    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.urlList = [];
        this.order.acceptedOffers.forEach((acceptedOffer) => {
            if (acceptedOffer.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                return;
            }
            const ticketToken = <string>acceptedOffer.itemOffered.reservedTicket.ticketToken;
            const basicSize = 21;
            const option: qrcode.QRCodeToDataURLOptions = {
                margin: 0,
                scale: (60 / basicSize)
            };
            const url = qrcode.toDataURL(ticketToken, option);
            this.urlList.push(url);
        });
    }

}
