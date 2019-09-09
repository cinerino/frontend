import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PurchaseCinemaCartComponent } from './components/pages/cinema/purchase-cinema-cart/purchase-cinema-cart.component';
import { PurchaseCinemaScheduleComponent } from './components/pages/cinema/purchase-cinema-schedule/purchase-cinema-schedule.component';
import { PurchaseCinemaSeatComponent } from './components/pages/cinema/purchase-cinema-seat/purchase-cinema-seat.component';
import { PurchaseCinemaTicketComponent } from './components/pages/cinema/purchase-cinema-ticket/purchase-cinema-ticket.component';
import { PurchaseEventScheduleComponent } from './components/pages/event/purchase-event-schedule/purchase-event-schedule.component';
import { PurchaseEventTicketComponent } from './components/pages/event/purchase-event-ticket/purchase-event-ticket.component';
import { PurchaseBaseComponent } from './components/pages/purchase-base/purchase-base.component';
import { PurchaseCompleteComponent } from './components/pages/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from './components/pages/purchase-confirm/purchase-confirm.component';
import { PurchaseInputComponent } from './components/pages/purchase-input/purchase-input.component';
import { PurchaseRootComponent } from './components/pages/purchase-root/purchase-root.component';
import { PurchaseTransactionComponent } from './components/pages/purchase-transaction/purchase-transaction.component';
import {
  PurchaseCinemaPerformanceComponent
} from './components/parts/cinema/purchase-cinema-performance/purchase-cinema-performance.component';
import {
  PurchaseEventPerformanceConfirmComponent
} from './components/parts/event/purchase-event-performance-confirm/purchase-event-performance-confirm.component';
import {
  PurchaseEventPerformanceComponent
} from './components/parts/event/purchase-event-performance/purchase-event-performance.component';
import { PurchaseInfoComponent } from './components/parts/purchase-info/purchase-info.component';
import { PurchaseTermsComponent } from './components/parts/purchase-terms/purchase-terms.component';
import { PurchaseWarningComponent } from './components/parts/purchase-warning/purchase-warning.component';
import { ScreenComponent } from './components/parts/screen/screen.component';
import { TransactionRemainingTimeComponent } from './components/parts/transaction-remaining-time/transaction-remaining-time.component';
import { PurchaseRoutingModule } from './purchase-routing.module';



@NgModule({
  declarations: [
    PurchaseBaseComponent,
    PurchaseInputComponent,
    PurchaseConfirmComponent,
    PurchaseCompleteComponent,
    PurchaseInfoComponent,
    PurchaseCinemaCartComponent,
    PurchaseCinemaScheduleComponent,
    PurchaseCinemaSeatComponent,
    PurchaseCinemaTicketComponent,
    PurchaseEventTicketComponent,
    PurchaseEventPerformanceComponent,
    PurchaseEventPerformanceConfirmComponent,
    PurchaseRootComponent,
    PurchaseCinemaPerformanceComponent,
    PurchaseEventScheduleComponent,
    PurchaseTransactionComponent,
    PurchaseTermsComponent,
    PurchaseWarningComponent,
    ScreenComponent,
    TransactionRemainingTimeComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    SharedModule,
  ],
  exports: []
})
export class PurchaseModule { }
