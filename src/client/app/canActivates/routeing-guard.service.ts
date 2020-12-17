/**
 * RouteingGuardService
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { getEnvironment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RouteingGuardService implements CanActivate {

    constructor() { }

    /**
     * 認証
     */
    public canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const root = state.url.split('/')[1];
        const findResult = getEnvironment().ARROW_ROUTEING.find(a => a === root);
        if (findResult === undefined) {
            location.href = '/404.html';
            return false;
        }
        return true;
    }
}
