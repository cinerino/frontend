/**
 * AppComponent
 */
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../services';
import { purchaseAction, userAction } from '../../store/actions';
import * as reducers from '../../store/reducers';

declare const ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public isRouter: boolean;
    constructor(
        private router: Router,
        private translate: TranslateService,
        private util: UtilService,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.isRouter = false;
        this.locales();
        if (environment.ANALYTICS_ID !== '') {
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
        const external = await this.util.getExternal();
        const theaterBranchCode = external.theaterBranchCode;
        const workPerformedId = external.workPerformedId;
        const superEventId = external.superEventId;
        const eventId = external.eventId;
        const scheduleDate = external.scheduleDate;
        this.store.dispatch(new purchaseAction.SetExternal({
            theaterBranchCode,
            workPerformedId,
            superEventId,
            eventId,
            scheduleDate
        }));
        const language = external.language;
        if (language !== undefined) {
            this.store.dispatch(new userAction.UpdateLanguage({ language }));
        }
    }

    /**
     * 言語設定
     * @example {{ 'HOME.HELLO' | translate: { value: 'world'} }}
     */
    private locales() {
        this.translate.addLangs(['ja', 'en']);
        this.translate.setDefaultLang('ja');
        console.log('translate', this.translate);
    }

    /**
     * Googleアナリティクス pageview イベント
     */
    private analytics() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Googleアナリティクス pageview
                try {
                    ga('create', environment.ANALYTICS_ID, 'auto');
                    ga('set', 'page', event.urlAfterRedirects);
                    ga('send', 'pageview');
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
}
