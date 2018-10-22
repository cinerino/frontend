import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-signout',
    templateUrl: './auth-signout.component.html',
    styleUrls: ['./auth-signout.component.scss']
})
export class AuthSignoutComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    public ngOnInit() {
        this.router.navigate(['/']);
    }

}
