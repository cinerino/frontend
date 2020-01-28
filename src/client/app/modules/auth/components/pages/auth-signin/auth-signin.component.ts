import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { OrderService, PurchaseService, UserService } from '../../../../../services';
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
        private purchaseService: PurchaseService,
        private userService: UserService,
        private orderService: OrderService,
        private store: Store<reducers.IState>
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.process = this.store.pipe(select(reducers.getProcess));
        this.purchaseService.delete();
        this.userService.delete();
        this.userService.initialize();
        this.orderService.delete();

        try {
            await this.userService.getProfile();
            await this.userService.getCreditCards();
            await this.userService.getAccount();
            this.router.navigate([this.environment.BASE_URL]);
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

}
