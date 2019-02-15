import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { UpdateLanguage } from '../../../store/actions/user.action';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public language: string;
    public isMenuOpen: boolean;
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.user.subscribe((user) => {
            this.language = user.language;
            this.translate.use(this.language);
            const html = <HTMLElement>document.querySelector('html');
            html.setAttribute('lang', this.language);
        }).unsubscribe();
        this.isMenuOpen = false;
    }

    public changeLanguage() {
        this.translate.use(this.language);
        const language = this.language;
        this.store.dispatch(new UpdateLanguage({ language }));
        const html = <HTMLElement>document.querySelector('html');
        html.setAttribute('lang', this.language);
        // console.log('translate', this.translate);
    }

    public menuOpen() {
        this.isMenuOpen = true;
    }

    public menuClose() {
        this.isMenuOpen = false;
    }

}
