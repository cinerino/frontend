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
import { masterAction, purchaseAction } from '../../../../../store/actions';
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
    public scheduleDate: string;
    public environment = environment;
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.screeningWorkEvents = [];
        if (this.scheduleDate === undefined || this.scheduleDate === '') {
            this.scheduleDate = moment()
                .add(environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                .format('YYYY-MM-DD');
        }
        this.getSellers();
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    /**
     * 更新
     */
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
     * 販売者情報一覧取得
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
     * 販売者選択
     */
    public selectSeller(seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>) {
        this.store.dispatch(new purchaseAction.SelectSeller({ seller }));
        setTimeout(() => {
            this.selectDate();
        }, 0);
    }

    /**
     * 日付選択
     */
    public selectDate() {
        this.purchase.subscribe((purchase) => {
            const seller = purchase.seller;
            if (seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            if (this.scheduleDate === '') {
                this.scheduleDate = moment()
                    .add(environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                    .format('YYYY-MM-DD');
            }
            const scheduleDate = this.scheduleDate;
            this.store.dispatch(new purchaseAction.SelectScheduleDate({ scheduleDate }));
            this.store.dispatch(new masterAction.GetSchedule({
                superEvent: {
                    ids:
                        (purchase.external === undefined || purchase.external.superEventId === undefined)
                            ? [] : [purchase.external.superEventId],
                    locationBranchCodes:
                        (seller.location === undefined || seller.location.branchCode === undefined)
                            ? [] : [seller.location.branchCode]
                },
                startFrom: moment(scheduleDate).toDate(),
                startThrough: moment(scheduleDate).add(1, 'day').toDate()
            }));
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

    /**
     * 仮予約削除
     */
    private async cancelTemporaryReservations() {
        return new Promise((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                const authorizeSeatReservations = purchase.authorizeSeatReservations;
                this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
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

    /**
     * 次へ
     */
    public async onSubmit() {
        try {
            await this.cancelTemporaryReservations();
            await this.startTransaction();
            this.router.navigate(['/purchase/event/ticket']);
        } catch (error) {
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
            this.router.navigate(['/error']);
        }
    }

}
