/**
 * NgModule
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BsDatepickerModule, ModalModule, PaginationModule } from 'ngx-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import {
    AuthIndexComponent,
    AuthSigninComponent,
    AuthSignoutComponent,
    BaseComponent,
    CongestionComponent,
    ErrorComponent,
    ExpiredComponent,
    InquiryConfirmComponent,
    InquiryInputComponent,
    MaintenanceComponent,
    MypageCoinComponent,
    MypageCreditComponent,
    MypageIndexComponent,
    MypageProfileComponent,
    NotfoundComponent,
    OrderSearchComponent,
    PurchaseBaseComponent,
    PurchaseCinemaCartComponent,
    PurchaseCinemaScheduleComponent,
    PurchaseCinemaSeatComponent,
    PurchaseCinemaTicketComponent,
    PurchaseCompleteComponent,
    PurchaseConfirmComponent,
    PurchaseEventScheduleComponent,
    PurchaseEventTicketComponent,
    PurchaseInputComponent,
    PurchaseRootComponent,
    PurchaseTransactionComponent,
    SettingComponent
} from './components/pages';
import {
    AlertModalComponent,
    ChargeCoinModalComponent,
    ConfirmModalComponent,
    ContentsComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    LoadingComponent,
    MvtkCheckModalComponent,
    OrderDetailModalComponent,
    PurchaseCinemaPerformanceComponent,
    PurchaseCinemaTicketModalComponent,
    PurchaseEventPerformanceComponent,
    PurchaseEventPerformanceConfirmComponent,
    PurchaseEventTicketModalComponent,
    PurchaseInfoComponent,
    PurchaseTermsComponent,
    PurchaseTransactionModalComponent,
    PurchaseWarningComponent,
    QrCodeModalComponent,
    RegisteredCreditCardModalComponent,
    ScreenComponent,
    SecurityCodeModalComponent,
    TransactionRemainingTimeComponent
} from './components/parts';
import { ChangeLanguagePipe } from './pipes/change-language.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format.pipe';
import { StoreModule } from './store.module';
import { CoreStoreModule } from './store/core/store';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/storage/i18n/');
}

@NgModule({
    declarations: [
        AppComponent,
        AuthSigninComponent,
        AuthSignoutComponent,
        PurchaseBaseComponent,
        PurchaseInputComponent,
        PurchaseConfirmComponent,
        PurchaseCompleteComponent,
        NotfoundComponent,
        AuthIndexComponent,
        ContentsComponent,
        HeaderComponent,
        FooterComponent,
        ScreenComponent,
        PurchaseCinemaTicketModalComponent,
        PurchaseEventTicketModalComponent,
        AlertModalComponent,
        PurchaseInfoComponent,
        LoadingComponent,
        ErrorComponent,
        BaseComponent,
        HeaderMenuComponent,
        ConfirmModalComponent,
        MvtkCheckModalComponent,
        SettingComponent,
        InquiryInputComponent,
        InquiryConfirmComponent,
        LibphonenumberFormatPipe,
        CongestionComponent,
        MaintenanceComponent,
        PurchaseTransactionModalComponent,
        SecurityCodeModalComponent,
        QrCodeModalComponent,
        TransactionRemainingTimeComponent,
        ExpiredComponent,
        OrderSearchComponent,
        OrderDetailModalComponent,
        ChangeLanguagePipe,
        FormatDatePipe,
        PurchaseCinemaCartComponent,
        PurchaseCinemaScheduleComponent,
        PurchaseCinemaSeatComponent,
        PurchaseCinemaTicketComponent,
        PurchaseEventTicketComponent,
        PurchaseEventPerformanceComponent,
        PurchaseEventPerformanceConfirmComponent,
        PurchaseRootComponent,
        PurchaseCinemaPerformanceComponent,
        PurchaseEventScheduleComponent,
        MypageIndexComponent,
        MypageProfileComponent,
        MypageCreditComponent,
        MypageCoinComponent,
        ChargeCoinModalComponent,
        RegisteredCreditCardModalComponent,
        PurchaseTransactionComponent,
        PurchaseTermsComponent,
        PurchaseWarningComponent
    ],
    entryComponents: [
        PurchaseCinemaTicketModalComponent,
        PurchaseEventTicketModalComponent,
        AlertModalComponent,
        ConfirmModalComponent,
        QrCodeModalComponent,
        MvtkCheckModalComponent,
        PurchaseTransactionModalComponent,
        SecurityCodeModalComponent,
        OrderDetailModalComponent,
        ChargeCoinModalComponent,
        RegisteredCreditCardModalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SwiperModule,
        StoreModule,
        CoreStoreModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
