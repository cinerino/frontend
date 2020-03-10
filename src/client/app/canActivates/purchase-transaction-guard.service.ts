/**
 * PurchaseTransactionGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PurchaseService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class PurchaseTransactionGuardService implements CanActivate {

    constructor(
        private router: Router,
        private purchaseService: PurchaseService
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            const transaction = (await this.purchaseService.getData()).transaction;
            if (transaction === undefined) {
                throw new Error('transaction not found').message;
            }

            return true;
        } catch (error) {
            console.log('canActivate', error);
            this.router.navigate(['/error']);

            return false;
        }
    }
}
