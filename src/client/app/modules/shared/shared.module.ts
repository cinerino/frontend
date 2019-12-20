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
import { AccountChargeModalComponent } from './components/parts/account/charge-modal/charge-modal.component';
import { AccountOpenModalComponent } from './components/parts/account/open-modal/open-modal.component';
import { AccountTransferModalComponent } from './components/parts/account/transfer-modal/transfer-modal.component';
import { AlertModalComponent } from './components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/parts/confirm-modal/confirm-modal.component';
import { ContentsComponent } from './components/parts/contents/contents.component';
import { CreditcardRegisterModalComponent } from './components/parts/creditcard/register-modal/register-modal.component';
import { CreditCardSelectModalComponent } from './components/parts/creditcard/select-modal/select-modal.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { HeaderMenuComponent } from './components/parts/header-menu/header-menu.component';
import { HeaderComponent } from './components/parts/header/header.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MvtkCheckModalComponent } from './components/parts/mvtk-check-modal/mvtk-check-modal.component';
import { NumericKeypadComponent } from './components/parts/numeric-keypad/numeric-keypad.component';
import { OrderDetailModalComponent } from './components/parts/order-detail-modal/order-detail-modal.component';
import { PurchaseCinemaTicketModalComponent } from './components/parts/purchase/cinema/ticket-modal/ticket-modal.component';
import { PurchaseEventTicketModalComponent } from './components/parts/purchase/event/ticket-modal/ticket-modal.component';
import { PurchaseTransactionModalComponent } from './components/parts/purchase/transaction-modal/transaction-modal.component';
import { QrCodeModalComponent } from './components/parts/qrcode-modal/qrcode-modal.component';
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
  CreditcardRegisterModalComponent,
  CreditCardSelectModalComponent,
  AccountChargeModalComponent,
  AccountTransferModalComponent,
  AccountOpenModalComponent,
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
