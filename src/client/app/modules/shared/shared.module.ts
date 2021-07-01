import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BaseComponent } from './components/pages/base/base.component';
import { AccountChargeModalComponent } from './components/parts/account/charge-modal/charge-modal.component';
import { AccountOpenModalComponent } from './components/parts/account/open-modal/open-modal.component';
import { AccountTransferModalComponent } from './components/parts/account/transfer-modal/transfer-modal.component';
import { AlertModalComponent } from './components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/parts/confirm-modal/confirm-modal.component';
import { ContentsComponent } from './components/parts/contents/contents.component';
import { CreditcardRegisterModalComponent } from './components/parts/creditcard/register-modal/register-modal.component';
import { CreditcardSecurityCodeModalComponent } from './components/parts/creditcard/security-code-modal/security-code-modal.component';
import { CreditCardSelectModalComponent } from './components/parts/creditcard/select-modal/select-modal.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { CheckboxComponent } from './components/parts/form/checkbox/checkbox.component';
import { HeaderMenuComponent } from './components/parts/header-menu/header-menu.component';
import { HeaderComponent } from './components/parts/header/header.component';
import { InputCreditcardComponent } from './components/parts/input-creditcard/input-creditcard.component';
import { InputCustomerComponent } from './components/parts/input-customer/input-customer.component';
import { ItemEventComponent } from './components/parts/item-event/item-event.component';
import { ItemListComponent } from './components/parts/item-list/item-list.component';
import { ItemPaymentMethodComponent } from './components/parts/item-payment-method/item-payment-method.component';
import { ItemProductComponent } from './components/parts/item-product/item-product.component';
import { ItemProfileComponent } from './components/parts/item-profile/item-profile.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MembershipCheckModalComponent } from './components/parts/membership/check-modal/check-modal.component';
import { MovieTicketCheckModalComponent } from './components/parts/movieticket/check-modal/check-modal.component';
import { NumericKeypadComponent } from './components/parts/numeric-keypad/numeric-keypad.component';
import { OrderDetailComponent } from './components/parts/order/detail/detail.component';
import { PurchaseEventTicketModalComponent } from './components/parts/purchase/event/ticket-modal/ticket-modal.component';
import { PurchaseSeatTicketModalComponent } from './components/parts/purchase/seat-ticket-modal/seat-ticket-modal.component';
import { QRCodeImageComponent } from './components/parts/qrcode/image/image.component';
import { QRCodeReaderModalComponent } from './components/parts/qrcode/reader-modal/reader-modal.component';
import { QRCodeViewerModalComponent } from './components/parts/qrcode/viewer-modal/viewer-modal.component';
import { TransactionRemainingTimeComponent } from './components/parts/transaction-remaining-time/transaction-remaining-time.component';
import { ChangeLanguagePipe } from './pipes/change-language.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format.pipe';

const components = [
    LoadingComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    ContentsComponent,
    BaseComponent,
    CheckboxComponent,
    QRCodeImageComponent,
    OrderDetailComponent,
    ItemEventComponent,
    ItemListComponent,
    ItemPaymentMethodComponent,
    ItemProfileComponent,
    ItemProductComponent,
    InputCreditcardComponent,
    InputCustomerComponent,
    TransactionRemainingTimeComponent,
];

const entryComponents = [
    AlertModalComponent,
    ConfirmModalComponent,
    QRCodeReaderModalComponent,
    QRCodeViewerModalComponent,
    CreditcardRegisterModalComponent,
    CreditCardSelectModalComponent,
    CreditcardSecurityCodeModalComponent,
    AccountChargeModalComponent,
    AccountTransferModalComponent,
    AccountOpenModalComponent,
    PurchaseSeatTicketModalComponent,
    PurchaseEventTicketModalComponent,
    MovieTicketCheckModalComponent,
    MembershipCheckModalComponent,
    NumericKeypadComponent,
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
        ModalModule,
        BsDatepickerModule,
        PaginationModule,
        NgxIntlTelInputModule,
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
        ModalModule,
        BsDatepickerModule,
        PaginationModule,
        NgxIntlTelInputModule,
    ],
    providers: [],
})
export class SharedModule {}
