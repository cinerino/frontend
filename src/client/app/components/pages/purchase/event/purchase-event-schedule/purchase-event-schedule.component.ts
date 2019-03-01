import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { SERVICE_UNAVAILABLE, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IScreeningEventWork, screeningEventsToWorkEvents } from '../../../../../functions';
import * as masterAction from '../../../../../store/actions/master.action';
import * as purchaseAction from '../../../../../store/actions/purchase.action';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-event-schedule',
    templateUrl: './purchase-event-schedule.component.html',
    styleUrls: ['./purchase-event-schedule.component.scss']
})
export class PurchaseEventScheduleComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public screeningWorkEvents: IScreeningEventWork[];
    public moment: typeof moment = moment;
    private updateTimer: any;
    public scheduleDate: string;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router) { }

    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.screeningWorkEvents = [];
        if (this.scheduleDate === undefined || this.scheduleDate === '') {
            this.scheduleDate = moment().format('YYYY-MM-DD');
        }
        this.cancelTemporaryReservations();
    }

    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(() => {
            this.purchase.subscribe((purchase) => {
                if (purchase.seller === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                this.selectSeller(purchase.seller);
            }).unsubscribe();
        }, time);
    }

    /**
     * getSellers
     */
    public getSellers() {
        this.store.dispatch(new masterAction.GetSellers({ params: {} }));

        const success = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetSellersSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    this.master.subscribe((master) => {
                        const seller = (purchase.seller === undefined)
                            ? master.sellers[0]
                            : purchase.seller;
                        this.selectSeller(seller);
                    }).unsubscribe();
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetSellersFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * selectSeller
     */
    public selectSeller(seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>) {
        this.store.dispatch(new purchaseAction.SelectSeller({ seller }));
        setTimeout(() => {
            this.selectDate();
        }, 0);
    }

    /**
     * selectDate
     */
    public selectDate() {
        this.purchase.subscribe((purchase) => {
            const seller = purchase.seller;
            if (seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const scheduleDate = this.scheduleDate;
            this.store.dispatch(new purchaseAction.SelectScheduleDate({ scheduleDate }));
            this.store.dispatch(new masterAction.GetSchedule({ seller, scheduleDate }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetScheduleSuccess),
            tap(() => {
                this.master.subscribe((master) => {
                    const screeningEvents = master.screeningEvents;
                    this.screeningWorkEvents = screeningEventsToWorkEvents({ screeningEvents });
                    this.update();
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetScheduleFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    private cancelTemporaryReservations() {
        this.purchase.subscribe((purchase) => {
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));
        }).unsubscribe();


        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
            tap(() => {
                this.store.dispatch(new purchaseAction.Delete());
                this.getSellers();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
            tap(() => {
                this.store.dispatch(new purchaseAction.Delete());
                this.getSellers();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    private startTransaction() {
        this.purchase.subscribe((purchase) => {
            if (purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }

            this.store.dispatch(new purchaseAction.StartTransaction({
                params: {
                    expires: moment().add(environment.TRANSACTION_TIME, 'minutes').toDate(),
                    seller: {
                        typeOf: purchase.seller.typeOf,
                        id: purchase.seller.id
                    },
                    object: {}
                }
            }));
        }).unsubscribe();


        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.StartTransactionSuccess),
            tap(() => {
                this.router.navigate(['/purchase/event/ticket']);
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.StartTransactionFail),
            tap(() => {
                this.error.subscribe((error) => {
                    try {
                        if (error === null) {
                            throw new Error('error is null');
                        }
                        const errorObject = JSON.parse(error);
                        if (errorObject.status === TOO_MANY_REQUESTS) {
                            this.router.navigate(['/congestion']);
                            return;
                        }
                        if (errorObject.status === SERVICE_UNAVAILABLE) {
                            this.router.navigate(['/maintenance']);
                            return;
                        }
                        throw new Error('error status not match');
                    } catch (error2) {
                        this.router.navigate(['/error']);
                    }
                }).unsubscribe();
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    public onSubmit() {
        this.startTransaction();
    }

}
