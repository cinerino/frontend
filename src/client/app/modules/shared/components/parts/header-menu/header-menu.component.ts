/**
 * HeaderMenuComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CinerinoService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
    @Input() public isOpen: boolean;
    @Output() public close: EventEmitter<{}> = new EventEmitter();
    public user: Observable<reducers.IUserState>;
    public environment = environment;

    constructor(
        private store: Store<reducers.IState>,
        private cinerino: CinerinoService,
        private router: Router,
        private utilService: UtilService,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
    }

    public signIn() {
        this.close.emit();
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('menu.confirm.login'),
            cb: () => {
                this.router.navigate(['/auth']);
            }
        });
    }

    public signOut() {
        this.close.emit();
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('menu.confirm.logout'),
            cb: async () => {
                try {
                    await this.cinerino.getServices();
                    await this.cinerino.signOut();
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }

    public isVisible(value: string) {
        return (this.environment.HEADER_MENU_SCOPE.find(h => h === value) !== undefined);
    }

}
