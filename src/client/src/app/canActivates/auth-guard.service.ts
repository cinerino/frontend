/**
 * AuthGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CinerinoService } from '../services/cinerino.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private cinerino: CinerinoService
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            await this.cinerino.getServices();

            return true;
        } catch (error) {
            console.log('canActivate', error);
            this.router.navigate(['/']);

            return false;
        }
    }
}
