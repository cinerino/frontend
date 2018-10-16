import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ActionTypes, Reserve } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-confirm',
    templateUrl: './purchase-confirm.component.html',
    styleUrls: ['./purchase-confirm.component.scss']
})
export class PurchaseConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public moment: typeof moment = moment;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
    }

    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            this.store.dispatch(new Reserve({ transaction }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.ReserveSuccess),
            tap(() => {
                this.router.navigate(['/purchase/complete']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.ReserveFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
