/**
 * NgModule
 */

import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as moment from 'moment';
import { BsDatepickerModule, ModalModule, PaginationModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { getProject } from './functions';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { StoreModule } from './store.module';
import { CoreStoreModule } from './store/core/store';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `${getProject().storageUrl}/i18n/`, `.json?date=${moment().toISOString()}`);
}

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
