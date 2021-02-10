import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseTransactionGuardService, ViewTypeGuardService } from '../../canActivates';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { PurchaseCinemaOverlapComponent } from './components/pages/cinema/purchase-cinema-overlap/purchase-cinema-overlap';
import { PurchaseCinemaScheduleComponent } from './components/pages/cinema/purchase-cinema-schedule/purchase-cinema-schedule.component';
import { PurchaseCinemaSeatComponent } from './components/pages/cinema/purchase-cinema-seat/purchase-cinema-seat.component';
import { PurchaseCinemaTicketComponent } from './components/pages/cinema/purchase-cinema-ticket/purchase-cinema-ticket.component';
import { PurchaseEventDateComponent } from './components/pages/event/purchase-event-date/purchase-event-date.component';
import { PurchaseEventScheduleComponent } from './components/pages/event/purchase-event-schedule/purchase-event-schedule.component';
import { PurchaseEventSeatComponent } from './components/pages/event/purchase-event-seat/purchase-event-seat.component';
import { PurchaseEventTicketComponent } from './components/pages/event/purchase-event-ticket/purchase-event-ticket.component';
import { PurchaseBaseComponent } from './components/pages/purchase-base/purchase-base.component';
import { PurchaseCompleteComponent } from './components/pages/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from './components/pages/purchase-confirm/purchase-confirm.component';
import { PurchaseInputComponent } from './components/pages/purchase-input/purchase-input.component';
import { PurchaseRootComponent } from './components/pages/purchase-root/purchase-root.component';
import { PurchaseTransactionComponent } from './components/pages/purchase-transaction/purchase-transaction.component';


const routes: Routes = [
  {
    path: '',
    component: PurchaseBaseComponent,
    children: [
      {
        path: 'cinema',
        canActivate: [ViewTypeGuardService],
        children: [
          { path: 'overlap', component: PurchaseCinemaOverlapComponent },
          { path: 'seat', component: PurchaseCinemaSeatComponent },
          { path: 'ticket', component: PurchaseCinemaTicketComponent },
        ]
      },
      {
        path: 'event',
        canActivate: [ViewTypeGuardService],
        children: [
          { path: 'schedule', component: PurchaseEventScheduleComponent },
          { path: 'seat', component: PurchaseEventSeatComponent },
          { path: 'ticket', component: PurchaseEventTicketComponent },
        ]
      },
      { path: 'input', canActivate: [PurchaseTransactionGuardService], component: PurchaseInputComponent },
      { path: 'confirm', canActivate: [PurchaseTransactionGuardService], component: PurchaseConfirmComponent },
      { path: 'complete', component: PurchaseCompleteComponent }
    ]
  },
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'root', component: PurchaseRootComponent },
      { path: 'transaction', component: PurchaseTransactionComponent },
      {
        path: 'cinema',
        canActivate: [ViewTypeGuardService],
        children: [
          { path: 'schedule', component: PurchaseCinemaScheduleComponent }
        ]
      },
      {
        path: 'event',
        canActivate: [ViewTypeGuardService],
        children: [
          { path: 'date', component: PurchaseEventDateComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
