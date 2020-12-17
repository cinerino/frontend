import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { OrderPointTransferCompleteComponent } from './components/pages/order-point-transfer-complete/order-point-transfer-complete.component';
import { OrderPointTransferConfirmComponent } from './components/pages/order-point-transfer-confirm/order-point-transfer-confirm.component';
import { OrderPointTransferInputComponent } from './components/pages/order-point-transfer-input/order-point-transfer-input.component';


const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'point/transfer',
        children: [
          { path: 'input', component: OrderPointTransferInputComponent },
          { path: 'confirm', component: OrderPointTransferConfirmComponent },
          { path: 'complete', component: OrderPointTransferCompleteComponent },
          { path: ':theaterCode/input', component: OrderPointTransferInputComponent },
          { path: ':theaterCode/confirm', component: OrderPointTransferConfirmComponent },
          { path: ':theaterCode/complete', component: OrderPointTransferCompleteComponent }
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
