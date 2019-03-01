import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getTicketPrice } from '../../../../../functions';
import { UtilService } from '../../../../../services';
import {
    ActionTypes,
    CancelTemporaryReservations,
    UnsettledDelete
} from '../../../../../store/actions/purchase.action';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-cart',
    templateUrl: './purchase-cinema-cart.component.html',
    styleUrls: ['./purchase-cinema-cart.component.scss']
})
export class PurchaseCinemaCartComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private util: UtilService,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.store.dispatch(new UnsettledDelete());
    }

    public removeItemProcess(
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
    ) {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new CancelTemporaryReservations({ authorizeSeatReservations }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationsSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationsFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.util.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('purchase.cinema.cart.confirm.cancel'),
            cb: () => {
                const authorizeSeatReservations = [authorizeSeatReservation];
                this.removeItemProcess(authorizeSeatReservations);
            }
        });
    }

}
