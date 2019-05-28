import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ViewType } from '../../../../models';
import { purchaseAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-transaction',
    templateUrl: './purchase-transaction.component.html',
    styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        this.store.dispatch(new purchaseAction.Delete());
        this.user.subscribe(async (user) => {
            if (user.viewType !== ViewType.Cinema) {
                this.router.navigate(['/error']);
                return;
            }
            const snapshot = this.activatedRoute.snapshot;
            const language = snapshot.params.language;
            const eventId = snapshot.params.eventId;
            this.store.dispatch(new purchaseAction.SetExternal({ eventId }));
            if (language !== undefined) {
                const element = document.querySelector<HTMLSelectElement>('#language');
                if (element !== null) {
                    element.value = language;
                }
            }
            try {
                await this.convertExternalToPurchase({ eventId });
                await this.startTransaction();
                this.router.navigate(['/purchase/cinema/seat']);
            } catch (error) {
                this.router.navigate(['/error']);
            }
        }).unsubscribe();
    }

    /**
     * 外部データを購入データへ変換
     */
    private async convertExternalToPurchase(params: { eventId: string; }) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new purchaseAction.ConvertExternalToPurchase({
                eventId: params.eventId
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.ConvertExternalToPurchaseSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.ConvertExternalToPurchaseFail),
                tap(() => { this.error.subscribe((error) => reject(error)).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 取引開始
     */
    private async startTransaction() {
        return new Promise((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                if (purchase.seller === undefined) {
                    reject(null);
                    return;
                }
                this.store.dispatch(new purchaseAction.StartTransaction({
                    params: {
                        expires: moment().add(environment.PURCHASE_TRANSACTION_TIME, 'minutes').toDate(),
                        seller: { typeOf: purchase.seller.typeOf, id: purchase.seller.id },
                        object: {}
                    }
                }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.StartTransactionSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.StartTransactionFail),
                tap(() => { this.error.subscribe((error) => reject(error)).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
