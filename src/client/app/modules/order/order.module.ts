import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OrderMoneyTransferCompleteComponent } from './components/pages/order-money-transfer-complete/order-money-transfer-complete.component';
import { OrderMoneyTransferConfirmComponent } from './components/pages/order-money-transfer-confirm/order-money-transfer-confirm.component';
import { OrderMoneyTransferInputComponent } from './components/pages/order-money-transfer-input/order-money-transfer-input.component';
import { OrderRoutingModule } from './order-routing.module';


@NgModule({
  declarations: [
    OrderMoneyTransferCompleteComponent,
    OrderMoneyTransferConfirmComponent,
    OrderMoneyTransferInputComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
  ]
})
export class OrderModule { }
