import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as orderAction from '../../../../store/actions/order.action';
import * as purchaseAction from '../../../../store/actions/purchase.action';
import * as user from '../../../../store/actions/user.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-auth-signout',
    templateUrl: './auth-signout.component.html',
    styleUrls: ['./auth-signout.component.scss']
})
export class AuthSignoutComponent implements OnInit {

    constructor(
        private router: Router,
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.store.dispatch(new orderAction.Delete());
        this.store.dispatch(new purchaseAction.Delete());
        this.store.dispatch(new user.Delete());
        this.router.navigate(['/']);
    }

}
