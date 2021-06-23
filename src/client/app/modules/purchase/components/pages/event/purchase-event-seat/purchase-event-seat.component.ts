import { Component } from '@angular/core';
import { PurchaseSeatComponent } from '../../purchase-seat/purchase-seat.component';

@Component({
    selector: 'app-purchase-event-seat',
    templateUrl: './purchase-event-seat.component.html',
    styleUrls: ['./purchase-event-seat.component.scss'],
})
export class PurchaseEventSeatComponent extends PurchaseSeatComponent {
    public async prev() {
        try {
            const { authorizeSeatReservation } =
                await this.actionService.purchase.getData();
            if (authorizeSeatReservation !== undefined) {
                const authorizeSeatReservations = [authorizeSeatReservation];
                await this.actionService.purchase.voidSeatReservation({
                    authorizeSeatReservations,
                });
            }
            this.router.navigate(['/purchase/event/schedule']);
        } catch (error) {
            console.error(error);
        }
    }
}
