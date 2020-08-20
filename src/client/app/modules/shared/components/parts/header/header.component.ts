import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public language: string;
    public isMenuOpen: boolean;
    public user: Observable<reducers.IUserState>;
    public environment = getEnvironment();
    public imageUrl: { pc: string; sp: string };

    constructor(
        private store: Store<reducers.IState>,
        private translate: TranslateService,
        private actionService: ActionService
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.user.subscribe(async (user) => {
            this.language = user.language;
            this.translate.use(this.language);
            const html = <HTMLElement>document.querySelector('html');
            html.setAttribute('lang', this.language);
        }).unsubscribe();
        this.isMenuOpen = false;
        this.imageUrl = {
            pc: `${Functions.Util.getProject().storageUrl}/images/logo.svg`,
            sp: `${Functions.Util.getProject().storageUrl}/images/logo-sp.svg`
        };
    }

    public changeLanguage() {
        this.actionService.user.updateLanguage(this.language);
    }

    public getLanguageName(key: string) {
        return (<any>Models.Common.Language)[key];
    }

    public menuOpen() {
        this.isMenuOpen = true;
    }

    public menuClose() {
        this.isMenuOpen = false;
    }

    public imageLoadingError(screenType: 'pc' | 'sp') {
        if (screenType === 'pc') {
            this.imageUrl.pc = '/default/images/logo.svg';
            return;
        }
        this.imageUrl.sp = '/default/images/logo-sp.svg';
    }

}
