import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getTicketPrice } from '../../../../functions';
import { UtilService } from '../../../../services';
import {
    ActionTypes,
    CancelTemporaryReservation,
    UnsettledDelete
} from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-cart',
    templateUrl: './purchase-cart.component.html',
    styleUrls: ['./purchase-cart.component.scss']
})
export class PurchaseCartComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public isLoading: Observable<boolean>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private util: UtilService
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.store.dispatch(new UnsettledDelete());
    }

    public removeItemProcess(
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>
    ) {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new CancelTemporaryReservation({ authorizeSeatReservation }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.util.openConfirm({
            title: '確認',
            body: '削除してよろしいですか。',
            cb: () => {
                this.removeItemProcess(authorizeSeatReservation);
            }
        });
    }

}
