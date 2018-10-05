import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { IPurchaseOrder } from '../../../models/history/purchaseOrder';

@Component({
    selector: 'app-purchase-detail-modal',
    templateUrl: './purchase-detail-modal.component.html',
    styleUrls: ['./purchase-detail-modal.component.scss']
})
export class PurchaseDetailModalComponent implements OnInit {
    @Input() public data: IPurchaseOrder;
    public moment: typeof moment = moment;
    public url: Promise<string>;
    constructor(
        public activeModal: NgbActiveModal
    ) { }

    public ngOnInit() {
        const ticketToken = <string>this.data.acceptedOffers[0].itemOffered.reservedTicket.ticketToken;
        const basicSize = 21;
        const option: qrcode.QRCodeToDataURLOptions = {
            margin: 0,
            scale: (80 / basicSize)
        };
        this.url = qrcode.toDataURL(ticketToken, option);
    }

}
