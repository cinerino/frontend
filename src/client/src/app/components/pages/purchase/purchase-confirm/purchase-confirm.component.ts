import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ActionTypes, Reservation } from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-confirm',
    templateUrl: './purchase-confirm.component.html',
    styleUrls: ['./purchase-confirm.component.scss']
})
export class PurchaseConfirmComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public startDate: string;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.purchase.subscribe((purchase) => {
            this.startDate = (purchase.screeningEvent === undefined)
            ? ''
            : moment(purchase.screeningEvent.startDate).format('YYYY/MM/DD (ddd) HH:mm');
        }).unsubscribe();
    }

    public onSubmit() {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const transaction = purchase.transaction;
            this.store.dispatch(new Reservation({ transaction }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.ReservationSuccess),
            tap(() => {
                this.router.navigate(['/purchase/complete']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.ReservationFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
