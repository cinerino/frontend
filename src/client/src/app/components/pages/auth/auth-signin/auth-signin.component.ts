import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    public ngOnInit() {
        this.router.navigate(['/purchase/schedule']);
    }

}
