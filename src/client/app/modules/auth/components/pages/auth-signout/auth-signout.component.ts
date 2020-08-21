import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from '../../../../../services';

@Component({
    selector: 'app-auth-signout',
    templateUrl: './auth-signout.component.html',
    styleUrls: ['./auth-signout.component.scss']
})
export class AuthSignoutComponent implements OnInit {

    constructor(
        private router: Router,
        private actionService: ActionService
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.actionService.order.delete();
        this.actionService.purchase.delete();
        this.actionService.user.delete();
        const logoutUrl = (sessionStorage.getItem('LOGOUT_URL') === null)
            ? '/' : sessionStorage.getItem('LOGOUT_URL');
        sessionStorage.removeItem('LOGOUT_URL');
        this.router.navigate([logoutUrl]);
    }

}
