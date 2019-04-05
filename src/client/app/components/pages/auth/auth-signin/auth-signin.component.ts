import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { orderAction, purchaseAction, userAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
    public process: Observable<string>;

    constructor(
        private router: Router,
        private actions: Actions,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.process = this.store.pipe(select(reducers.getProcess));
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new orderAction.Delete());
        this.store.dispatch(new userAction.Delete());
        this.store.dispatch(new userAction.Initialize());
        try {
            await this.initializeProfile();
            await this.getCreditCards();
            await this.initializeCoinAccount();
            this.router.navigate([environment.BASE_URL]);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * プロフィール情報初期化
     */
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

    /**
     * コイン口座情報初期化
     */
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

    /**
     * クレジットカード情報取得
     */
    private getCreditCards() {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new userAction.GetCreditCards());
            const success = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsSuccess),
                tap(() => {
                    resolve();
                })
            );
            const fail = this.actions.pipe(
                ofType(userAction.ActionTypes.GetCreditCardsFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
