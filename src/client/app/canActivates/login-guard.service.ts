/**
 * LoginGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Functions } from '..';

@Injectable({
    providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

    constructor(
        private router: Router,
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        const params = Functions.Util.getExternalData();
        if (params.redirectUrl !== undefined) {
            this.router.navigate(['/auth']);
            return false;
        }
        return true;
    }
}
