import { Component } from '@angular/core';
import { PurchaseTicketComponent } from '../../purchase-ticket/purchase-ticket.component';

@Component({
    selector: 'app-purchase-event-ticket',
    templateUrl: './purchase-event-ticket.component.html',
    styleUrls: ['./purchase-event-ticket.component.scss']
})
export class PurchaseEventTicketComponent extends PurchaseTicketComponent {
}
