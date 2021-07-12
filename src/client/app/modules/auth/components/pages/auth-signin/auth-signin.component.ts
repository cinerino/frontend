import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import {
    getAuthRedirectUrl,
    removeAuthRedirectUrl,
} from '../../../../../functions/util.function';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss'],
})
export class AuthSigninComponent implements OnInit {
    public process: Observable<string>;
    public environment = getEnvironment();

    constructor(
        private router: Router,
        private actionService: ActionService,
        private store: Store<reducers.IState>
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.process = this.store.pipe(select(reducers.getProcess));
        this.actionService.user.delete();
        this.actionService.user.initialize({ login: true });

        try {
            const url = getAuthRedirectUrl();
            const redirectUrl =
                url === undefined ? this.environment.BASE_URL : url;
            removeAuthRedirectUrl();
            location.href = redirectUrl;
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }
}
