/**
 * ViewTypeGuardService
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { getEnvironment } from '../../environments/environment';
import { ViewType } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ViewTypeGuardService implements CanActivate {

    constructor(
        private router: Router
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            const viewType = getEnvironment().VIEW_TYPE;
            if (state.url.match('/cinema') !== null && viewType !== ViewType.Cinema) {
                throw new Error('viewType not match');
            }

            if (state.url.match('/event') !== null && viewType !== ViewType.Event) {
                throw new Error('viewType not match');
            }

            return true;
        } catch (error) {
            console.error('canActivate', error);
            this.router.navigate(['/error']);

            return false;
        }
    }
}
