import { AuthGuardService } from '../canActivates';
import { PurchaseBaseComponent } from '../components/pages/purchase/purchase-base/purchase-base.component';
import { PurchaseCompleteComponent } from '../components/pages/purchase/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from '../components/pages/purchase/purchase-confirm/purchase-confirm.component';
import { PurchaseHistoryComponent } from '../components/pages/purchase/purchase-history/purchase-history.component';
import { PurchaseInputComponent } from '../components/pages/purchase/purchase-input/purchase-input.component';
import { PurchaseScheduleComponent } from '../components/pages/purchase/purchase-schedule/purchase-schedule.component';
import { PurchaseSeatComponent } from '../components/pages/purchase/purchase-seat/purchase-seat.component';
import { PurchaseTicketComponent } from '../components/pages/purchase/purchase-ticket/purchase-ticket.component';


/**
 * 購入ルーティング
 */
export const route = {
    path: 'purchase',
    component: PurchaseBaseComponent,
    canActivate: [AuthGuardService],
    children: [
        { path: 'seat', component: PurchaseSeatComponent },
        { path: 'ticket', component: PurchaseTicketComponent },
        { path: 'input', component: PurchaseInputComponent },
        { path: 'confirm', component: PurchaseConfirmComponent },
        { path: 'complete', component: PurchaseCompleteComponent },
        { path: 'schedule', component: PurchaseScheduleComponent },
        { path: 'history', component: PurchaseHistoryComponent }
    ]
};
