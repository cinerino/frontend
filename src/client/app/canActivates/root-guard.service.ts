/**
 * RootGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getEnvironment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RootGuardService implements CanActivate {

    constructor(
        private router: Router,
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        const navigate = getEnvironment().BASE_URL;
        this.router.navigate([navigate]);
        return false;
    }
}
