import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getTicketPrice } from '../../../../functions';
import {
    ActionTypes,
    CancelTemporaryReservation,
    RemoveShoppingCart,
    UnsettledDelete
} from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { AlertModalComponent } from '../../../parts/alert-modal/alert-modal.component';

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
        private modal: NgbModal,
        private actions: Actions,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
    }

    public openAlert(args: {
        title: string;
        body: string;
    }) {
        const modalRef = this.modal.open(AlertModalComponent, {
            centered: true
        });
        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }

    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.purchase.subscribe((purchase) => {
            if (purchase.transaction === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new CancelTemporaryReservation({ authorizeSeatReservation }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationSuccess),
            tap(() => {
                this.store.dispatch(new RemoveShoppingCart({ authorizeSeatReservation }));
                setTimeout(() => {
                    this.purchase.subscribe((purchase) => {
                        if (purchase.authorizeSeatReservations.length === 0) {
                            this.store.dispatch(new UnsettledDelete());
                            this.router.navigate(['/purchase/schedule']);
                        }
                    }).unsubscribe();
                }, 0);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.CancelTemporaryReservationFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
