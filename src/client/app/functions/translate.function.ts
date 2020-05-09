import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import * as deepmerge from 'deepmerge';
import * as moment from 'moment';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getEnvironment } from '../../environments/environment';
import { getProject } from './util.function';

/**
 * 多言語カスタムローダー
 */
export class CustomTranslateHttpLoader implements TranslateLoader {
    constructor(private http: HttpClient) { }

    public getTranslation(lang: string) {
        const suffix = `.json?date=${moment().toISOString()}`;
        const resources = [
            `/default/i18n/common/${lang}${suffix}`,
            `/default/i18n/${getEnvironment().VIEW_TYPE}/${lang}${suffix}`,
            `${getProject().storageUrl}/i18n/${lang}${suffix}`,
        ];

        return forkJoin(
            resources.map((url) => {
                return this.http.get(url).pipe(catchError((error) => {
                    console.error(error);
                    return of({});
                }));
            })
        ).pipe(
            map(response => {
                return response.reduce((a, b) => {
                    return deepmerge(a, b);
                });
            })
        );
    }
}

/**
 * 多言語設定取得
 */
export function getTranslateModuleConfig(): TranslateModuleConfig {
    return {
        loader: {
            provide: TranslateLoader,
            useClass: CustomTranslateHttpLoader,
            deps: [HttpClient]
        }
    };
}

