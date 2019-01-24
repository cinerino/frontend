/**
 * NgModule
 */

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AuthIndexComponent } from './components/pages/auth/auth-index/auth-index.component';
import { AuthSigninComponent } from './components/pages/auth/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from './components/pages/auth/auth-signout/auth-signout.component';
import { BaseComponent } from './components/pages/base/base.component';
import { CongestionComponent } from './components/pages/congestion/congestion.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { InquiryConfirmComponent } from './components/pages/inquiry/inquiry-confirm/inquiry-confirm.component';
import { InquiryHistoryComponent } from './components/pages/inquiry/inquiry-history/inquiry-history.component';
import { InquiryInputComponent } from './components/pages/inquiry/inquiry-input/inquiry-input.component';
import { MaintenanceComponent } from './components/pages/maintenance/maintenance.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { PurchaseBaseComponent } from './components/pages/purchase/purchase-base/purchase-base.component';
import { PurchaseCartComponent } from './components/pages/purchase/purchase-cart/purchase-cart.component';
import { PurchaseCompleteComponent } from './components/pages/purchase/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from './components/pages/purchase/purchase-confirm/purchase-confirm.component';
import { PurchaseInputComponent } from './components/pages/purchase/purchase-input/purchase-input.component';
import { PurchaseScheduleComponent } from './components/pages/purchase/purchase-schedule/purchase-schedule.component';
import { PurchaseSeatComponent } from './components/pages/purchase/purchase-seat/purchase-seat.component';
import { PurchaseTicketComponent } from './components/pages/purchase/purchase-ticket/purchase-ticket.component';
import { SettingComponent } from './components/pages/setting/setting.component';
import { AlertModalComponent } from './components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/parts/confirm-modal/confirm-modal.component';
import { ContentsComponent } from './components/parts/contents/contents.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { HeaderMenuComponent } from './components/parts/header-menu/header-menu.component';
import { HeaderComponent } from './components/parts/header/header.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MvtkCheckModalComponent } from './components/parts/mvtk-check-modal/mvtk-check-modal.component';
import { PurchaseContentsComponent } from './components/parts/purchase-contents/purchase-contents.component';
import { PurchaseInfoComponent } from './components/parts/purchase-info/purchase-info.component';
import { PurchaseScheduleFilmComponent } from './components/parts/purchase-schedule-film/purchase-schedule-film.component';
import { PurchaseTransactionModalComponent } from './components/parts/purchase-transaction-modal/purchase-transaction-modal.component';
import { QrCodeModalComponent } from './components/parts/qrcode-modal/qrcode-modal.component';
import { ScreenComponent } from './components/parts/screen/screen.component';
import { SecurityCodeModalComponent } from './components/parts/security-code-modal/security-code-modal.component';
import { TicketListModalComponent } from './components/parts/ticket-list-modal/ticket-list-modal.component';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format.pipe';
import { StoreModule } from './store.module';
import { CoreStoreModule } from './store/core/store';

@NgModule({
    declarations: [
        AppComponent,
        AuthSigninComponent,
        AuthSignoutComponent,
        PurchaseScheduleComponent,
        PurchaseBaseComponent,
        PurchaseSeatComponent,
        PurchaseTicketComponent,
        PurchaseInputComponent,
        PurchaseConfirmComponent,
        PurchaseCompleteComponent,
        NotfoundComponent,
        AuthIndexComponent,
        ContentsComponent,
        HeaderComponent,
        FooterComponent,
        PurchaseContentsComponent,
        PurchaseScheduleFilmComponent,
        ScreenComponent,
        TicketListModalComponent,
        AlertModalComponent,
        PurchaseInfoComponent,
        LoadingComponent,
        ErrorComponent,
        BaseComponent,
        HeaderMenuComponent,
        ConfirmModalComponent,
        InquiryHistoryComponent,
        MvtkCheckModalComponent,
        SettingComponent,
        InquiryInputComponent,
        InquiryConfirmComponent,
        LibphonenumberFormatPipe,
        CongestionComponent,
        MaintenanceComponent,
        PurchaseCartComponent,
        PurchaseTransactionModalComponent,
        SecurityCodeModalComponent,
        QrCodeModalComponent
    ],
    entryComponents: [
        TicketListModalComponent,
        AlertModalComponent,
        ConfirmModalComponent,
        QrCodeModalComponent,
        MvtkCheckModalComponent,
        PurchaseTransactionModalComponent,
        SecurityCodeModalComponent
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
        NgbModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
