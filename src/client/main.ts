/**
 * main
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/**
 * タイムゾーン設定
 */
import * as momentTimezone from 'moment-timezone';
momentTimezone.tz.setDefault('Asia/Tokyo');
momentTimezone.locale('ja');

/**
 * 言語設定
 */
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';
defineLocale('ja', jaLocale);

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
