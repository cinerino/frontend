import { Component } from '@angular/core';
import { PurchaseTicketComponent } from '../../purchase-ticket/purchase-ticket.component';

@Component({
    selector: 'app-purchase-cinema-ticket',
    templateUrl: './purchase-cinema-ticket.component.html',
    styleUrls: ['./purchase-cinema-ticket.component.scss']
})
export class PurchaseCinemaTicketComponent extends PurchaseTicketComponent {
}
