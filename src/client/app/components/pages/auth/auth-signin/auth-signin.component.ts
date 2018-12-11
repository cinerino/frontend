import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as inquiry from '../../../../store/actions/inquiry.action';
import * as purchase from '../../../../store/actions/purchase.action';
import * as user from '../../../../store/actions/user.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

    constructor(
        private router: Router,
        private actions: Actions,
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.store.dispatch(new purchase.Delete());
        this.store.dispatch(new inquiry.Delete());
        this.store.dispatch(new user.Delete());
        this.store.dispatch(new user.Initialize());
        this.store.dispatch(new user.Create());

        const success = this.actions.pipe(
            ofType(user.ActionTypes.CreateSuccess),
            tap(() => {
                this.router.navigate(['/purchase/schedule']);
            })
        );

        const fail = this.actions.pipe(
            ofType(user.ActionTypes.CreateFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();

    }

}
