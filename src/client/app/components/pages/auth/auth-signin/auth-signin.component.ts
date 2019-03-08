import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ILanguage } from '../../../../models';
import * as orderAction from '../../../../store/actions/order.action';
import * as purchaseAction from '../../../../store/actions/purchase.action';
import * as userAction from '../../../../store/actions/user.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
    public process: Observable<ILanguage>;

    constructor(
        private router: Router,
        private actions: Actions,
        private store: Store<reducers.IState>
    ) { }

    public async ngOnInit() {
        this.process = this.store.pipe(select(reducers.getProcess));
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new orderAction.Delete());
        this.store.dispatch(new userAction.Delete());
        this.store.dispatch(new userAction.Initialize());
        try {
            await this.initializeProfile();
            await this.initializeCoinAccount();
            this.router.navigate([environment.BASE_URL]);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    private initializeProfile() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.InitializeProfile());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeProfileSuccess),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeProfileFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    private initializeCoinAccount() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.InitializeCoinAccount());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeCoinAccountSuccess),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.InitializeCoinAccountFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
