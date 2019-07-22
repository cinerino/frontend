import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, PurchaseService, UserService } from '../../../../services';

@Component({
    selector: 'app-auth-signout',
    templateUrl: './auth-signout.component.html',
    styleUrls: ['./auth-signout.component.scss']
})
export class AuthSignoutComponent implements OnInit {

    constructor(
        private router: Router,
        private purchaseService: PurchaseService,
        private userService: UserService,
        private orderService: OrderService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.orderService.delete();
        this.purchaseService.delete();
        this.userService.delete();
        this.router.navigate(['/']);
    }

}
