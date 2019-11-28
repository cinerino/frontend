import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BsDatepickerModule,
  ModalModule,
  PaginationModule
} from 'ngx-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { BaseComponent } from './components/pages/base/base.component';
import { AlertModalComponent } from './components/parts/alert-modal/alert-modal.component';
import { ChargeAccountModalComponent } from './components/parts/charge-account-modal/charge-account-modal.component';
import { ConfirmModalComponent } from './components/parts/confirm-modal/confirm-modal.component';
import { ContentsComponent } from './components/parts/contents/contents.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { HeaderMenuComponent } from './components/parts/header-menu/header-menu.component';
import { HeaderComponent } from './components/parts/header/header.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MvtkCheckModalComponent } from './components/parts/mvtk-check-modal/mvtk-check-modal.component';
import { NumericKeypadComponent } from './components/parts/numeric-keypad/numeric-keypad.component';
import { OpenAccountModalComponent } from './components/parts/open-account-modal/open-account-modal.component';
import { OrderDetailModalComponent } from './components/parts/order-detail-modal/order-detail-modal.component';
import { PurchaseCinemaTicketModalComponent } from './components/parts/purchase-cinema-ticket-modal/purchase-cinema-ticket-modal.component';
import { PurchaseEventTicketModalComponent } from './components/parts/purchase-event-ticket-modal/purchase-event-ticket-modal.component';
import { PurchaseTransactionModalComponent } from './components/parts/purchase-transaction-modal/purchase-transaction-modal.component';
import { QrCodeModalComponent } from './components/parts/qrcode-modal/qrcode-modal.component';
import { RegisteredCreditCardModalComponent } from './components/parts/registered-credit-card-modal/registered-credit-card-modal.component';
import { SecurityCodeModalComponent } from './components/parts/security-code-modal/security-code-modal.component';
import { ChangeLanguagePipe } from './pipes/change-language.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format.pipe';

const components = [
  LoadingComponent,
  FooterComponent,
  HeaderComponent,
  HeaderMenuComponent,
  ContentsComponent,
  QrCodeModalComponent,
  BaseComponent,
];

const entryComponents = [
  AlertModalComponent,
  ConfirmModalComponent,
  QrCodeModalComponent,
  RegisteredCreditCardModalComponent,
  ChargeAccountModalComponent,
  OpenAccountModalComponent,
  OrderDetailModalComponent,
  PurchaseCinemaTicketModalComponent,
  PurchaseEventTicketModalComponent,
  PurchaseTransactionModalComponent,
  MvtkCheckModalComponent,
  NumericKeypadComponent,
  SecurityCodeModalComponent,
];

@NgModule({
  declarations: [
    ...components,
    ...entryComponents,
    LibphonenumberFormatPipe,
    ChangeLanguagePipe,
    FormatDatePipe,
  ],
  entryComponents,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SwiperModule,
    ModalModule,
    BsDatepickerModule,
    PaginationModule,
  ],
  exports: [
    ...components,
    ...entryComponents,
    LibphonenumberFormatPipe,
    ChangeLanguagePipe,
    FormatDatePipe,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SwiperModule,
    ModalModule,
    BsDatepickerModule,
    PaginationModule,
  ],
  providers: []
})
export class SharedModule { }
