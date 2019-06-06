import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { getTicketPrice, IEventOrder, orderToEventOrders } from '../../../functions';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.component.html',
    styleUrls: ['./order-detail-modal.component.scss']
})
export class OrderDetailModalComponent implements OnInit {
    @Input() public order: factory.order.IOrder;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public eventOrders: IEventOrder[];
    public environment = environment;

    constructor(
        private elementRef: ElementRef,
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
        this.eventOrders = orderToEventOrders({ order: this.order });
        const element: HTMLElement = this.elementRef.nativeElement.querySelector('.scroll-vertical');
        setTimeout(() => {
            element.scrollTop = 0;
        }, 0);
    }

}

