import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
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

    constructor(
        private router: Router,
        private actions: Actions,
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new orderAction.Delete());
        this.store.dispatch(new userAction.Delete());
        this.store.dispatch(new userAction.Initialize());
        this.store.dispatch(new userAction.Create());

        const success = this.actions.pipe(
            ofType(userAction.ActionTypes.CreateSuccess),
            tap(() => {
                this.router.navigate([environment.BASE_URL]);
            })
        );

        const fail = this.actions.pipe(
            ofType(userAction.ActionTypes.CreateFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();

    }

}
