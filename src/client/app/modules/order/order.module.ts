import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OrderSearchComponent } from './components/pages/order-search/order-search.component';
import { OrderRoutingModule } from './order-routing.module';



@NgModule({
  declarations: [
    OrderSearchComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
  ]
})
export class OrderModule { }
