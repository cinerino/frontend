import { BaseComponent } from '../components/pages/base/base.component';
import { PurchaseBaseComponent } from '../components/pages/purchase/purchase-base/purchase-base.component';
import { PurchaseCartComponent } from '../components/pages/purchase/purchase-cart/purchase-cart.component';
import { PurchaseCompleteComponent } from '../components/pages/purchase/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from '../components/pages/purchase/purchase-confirm/purchase-confirm.component';
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
    children: [
        { path: 'seat', component: PurchaseSeatComponent },
        { path: 'ticket', component: PurchaseTicketComponent },
        { path: 'input', component: PurchaseInputComponent },
        { path: 'confirm', component: PurchaseConfirmComponent },
        { path: 'complete', component: PurchaseCompleteComponent },
        { path: 'cart', component: PurchaseCartComponent }
    ]
};

/**
 * 購入スケジュールルーティング
 */
export const schedule = {
    path: 'purchase',
    component: BaseComponent,
    children: [
        { path: 'schedule', component: PurchaseScheduleComponent }
    ]
};
