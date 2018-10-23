import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as inquiry from '../../../../store/actions/inquiry.action';
import * as purchase from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

    constructor(
        private router: Router,
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.store.dispatch(new purchase.Delete());
        this.store.dispatch(new inquiry.Delete());
        this.router.navigate(['/purchase/schedule']);
    }

}
