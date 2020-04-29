import { Component } from '@angular/core';
import { PurchaseTicketComponent } from '../../purchase-ticket/purchase-ticket.component';

@Component({
    selector: 'app-purchase-event-seat-ticket',
    templateUrl: './purchase-event-seat-ticket.component.html',
    styleUrls: ['./purchase-event-seat-ticket.component.scss']
})
export class PurchaseEventSeatTicketComponent extends PurchaseTicketComponent {
}
