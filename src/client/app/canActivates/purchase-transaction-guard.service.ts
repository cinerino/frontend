/**
 * PurchaseTransactionGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActionService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class PurchaseTransactionGuardService implements CanActivate {

    constructor(
        private router: Router,
        private actionService: ActionService
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            const transaction = (await this.actionService.purchase.getData()).transaction;
            if (transaction === undefined) {
                throw new Error('transaction not found');
            }

            return true;
        } catch (error) {
            this.router.navigate(['/error']);

            return false;
        }
    }
}
