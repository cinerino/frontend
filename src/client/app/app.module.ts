/**
 * NgModule
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule, ModalModule, PaginationModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { getTranslateModuleConfig } from './functions/translate.function';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { StoreModule } from './store.module';
import { CoreStoreModule } from './store/core/store';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule,
        CoreStoreModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        TranslateModule.forRoot(getTranslateModuleConfig()),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
