import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as reducers from '../../store/reducers';

@Injectable({
    providedIn: 'root',
})
export class ActionStoreService {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    constructor(private store: Store<reducers.IState>) {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 購入データ取得
     */
    public async getPurchaseData() {
        return new Promise<reducers.IPurchaseState>((resolve) => {
            this.purchase
                .subscribe((purchase) => {
                    resolve(purchase);
                })
                .unsubscribe();
        });
    }
}
