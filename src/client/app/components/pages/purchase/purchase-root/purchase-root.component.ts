import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ViewType } from '../../../../models';
import { purchaseAction } from '../../../../store/actions';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-root',
    templateUrl: './purchase-root.component.html',
    styleUrls: ['./purchase-root.component.scss']
})
export class PurchaseRootComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.purchase.subscribe(async (purchase) => {
            if (purchase.authorizeSeatReservations.length > 0) {
                await this.cancelTemporaryReservations();
            }
            this.store.dispatch(new purchaseAction.Delete());
            this.user.subscribe((user) => {
                const snapshot = this.activatedRoute.snapshot;
                this.store.dispatch(new purchaseAction.SetExternal({
                    sellerId: snapshot.params.sellerId,
                    eventId: snapshot.params.eventId
                }));
                if (user.viewType === ViewType.Cinema) {
                    this.router.navigate(['/purchase/cinema/schedule']);
                    return;
                }
                this.router.navigate(['/purchase/event/schedule']);
            }).unsubscribe();
        }).unsubscribe();
    }

    private async cancelTemporaryReservations() {
        this.purchase.subscribe((purchase) => {
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));
        }).unsubscribe();

        return new Promise((resolve, reject) => {
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
                tap(() => { reject(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

}
