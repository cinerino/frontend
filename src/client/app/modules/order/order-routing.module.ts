import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { OrderMoneyTransferCompleteComponent } from './components/pages/order-money-transfer-complete/order-money-transfer-complete.component';
import { OrderMoneyTransferConfirmComponent } from './components/pages/order-money-transfer-confirm/order-money-transfer-confirm.component';
import { OrderMoneyTransferInputComponent } from './components/pages/order-money-transfer-input/order-money-transfer-input.component';


const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'money/transfer',
        children: [
          { path: 'input', component: OrderMoneyTransferInputComponent },
          { path: 'confirm', component: OrderMoneyTransferConfirmComponent },
          { path: 'complete', component: OrderMoneyTransferCompleteComponent },
          { path: ':theaterCode/input', component: OrderMoneyTransferInputComponent },
          { path: ':theaterCode/confirm', component: OrderMoneyTransferConfirmComponent },
          { path: ':theaterCode/complete', component: OrderMoneyTransferCompleteComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
