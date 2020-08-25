import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
    public process: Observable<string>;
    public environment = getEnvironment();

    constructor(
        private router: Router,
        private actionService: ActionService,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.process = this.store.pipe(select(reducers.getProcess));
        this.actionService.user.delete();
        this.actionService.user.initialize({ isMember: true });

        try {
            // await this.actionService.user.getProfile();
            // await this.actionService.user.getCreditCards();
            const redirectUrl = (sessionStorage.getItem('REDIRECT_URL') === null)
            ? this.environment.BASE_URL : sessionStorage.getItem('REDIRECT_URL');
            sessionStorage.removeItem('REDIRECT_URL');
            this.router.navigate([redirectUrl]);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

}
