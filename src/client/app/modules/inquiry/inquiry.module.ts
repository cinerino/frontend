import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { InquiryConfirmComponent } from './components/pages/inquiry-confirm/inquiry-confirm.component';
import { InquiryInputComponent } from './components/pages/inquiry-input/inquiry-input.component';
import { InquiryPrintComponent } from './components/pages/inquiry-print/inquiry-print.component';
import { InquiryRoutingModule } from './inquiry-routing.module';



@NgModule({
  declarations: [
    InquiryInputComponent,
    InquiryConfirmComponent,
    InquiryPrintComponent,
  ],
  imports: [
    CommonModule,
    InquiryRoutingModule,
    SharedModule,
  ]
})
export class InquiryModule { }
