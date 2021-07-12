/**
 * LoginGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuthRedirectUrl } from '../functions/util.function';

@Injectable({
    providedIn: 'root',
})
export class LoginGuardService implements CanActivate {
    constructor(private router: Router) {}

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        const url = getAuthRedirectUrl();
        if (url !== undefined) {
            this.router.navigate(['/auth']);
            return false;
        }
        return true;
    }
}
