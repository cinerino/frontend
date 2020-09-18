/**
 * AppComponent
 */
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Functions } from '..';
import { getEnvironment } from '../../environments/environment';
import { ActionService } from '../services';

declare const ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public isRouter: boolean;
    public environment = getEnvironment();

    constructor(
        private router: Router,
        private translate: TranslateService,
        private actionService: ActionService,
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.isRouter = false;
        this.locales();
        if (this.environment.ANALYTICS_ID !== '') {
            this.analytics();
        }
        try {
            await this.external();
        } catch (error) {
            console.error(error);
        }
        this.isRouter = true;
    }

    /**
     * 外部情報
     */
    public async external() {
        if (location.hash !== '') {
            return;
        }
        const language = Functions.Util.getExternalData().language;
        if (language !== undefined) {
            this.actionService.user.updateLanguage(language);
        }
    }

    /**
     * 言語設定
     * @example {{ 'HOME.HELLO' | translate: { value: 'world'} }}
     */
    private locales() {
        this.translate.addLangs(this.environment.LANGUAGE);
        this.translate.setDefaultLang('ja');
    }

    /**
     * Googleアナリティクス pageview イベント
     */
    private analytics() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Googleアナリティクス pageview
                try {
                    ga('create', this.environment.ANALYTICS_ID, 'auto');
                    ga('set', 'page', event.urlAfterRedirects);
                    ga('send', 'pageview');
                } catch (error) {
                    console.warn(error);
                }
            }
        });
    }
}
