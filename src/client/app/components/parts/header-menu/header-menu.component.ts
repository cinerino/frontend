/**
 * HeaderMenuComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CinerinoService, UtilService } from '../../../services';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
    @Input() public isOpen: boolean;
    @Output() public close: EventEmitter<{}> = new EventEmitter();
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerino: CinerinoService,
        private router: Router,
        private util: UtilService
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
    }

    public signIn() {
        this.close.emit();
        this.util.openConfirm({
            title: '確認',
            body: 'ログインしますか？',
            cb: () => {
                this.router.navigate(['/auth']);
            }

        });
    }

    public signOut() {
        this.close.emit();
        this.util.openConfirm({
            title: '確認',
            body: 'ログアウトしますか？',
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

}
