import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OrderPointTransferCompleteComponent } from './components/pages/order-point-transfer-complete/order-point-transfer-complete.component';
import { OrderPointTransferConfirmComponent } from './components/pages/order-point-transfer-confirm/order-point-transfer-confirm.component';
import { OrderPointTransferInputComponent } from './components/pages/order-point-transfer-input/order-point-transfer-input.component';
import { OrderRoutingModule } from './order-routing.module';


@NgModule({
  declarations: [
    OrderPointTransferCompleteComponent,
    OrderPointTransferConfirmComponent,
    OrderPointTransferInputComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
  ]
})
export class OrderModule { }
