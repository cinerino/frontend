import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
    ActionTypes,
    Delete,
    GetSchedule,
    GetTheaters,
    SelectSchedule,
    SelectTheater,
    StartTransaction
} from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-schedule',
    templateUrl: './purchase-schedule.component.html',
    styleUrls: ['./purchase-schedule.component.scss']
})
export class PurchaseScheduleComponent implements OnInit, OnDestroy {
    @ViewChild(SwiperComponent) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective) public directiveRef: SwiperDirective;
    public purchase: Observable<reducers.IPurchaseState>;
    public swiperConfig: SwiperConfigInterface;
    public scheduleDates: string[];
    public moment: typeof moment = moment;
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router
    ) { }

    public async ngOnInit() {
        this.swiperConfig = {
            spaceBetween: 1,
            slidesPerView: 7,
            breakpoints: {
                320: { slidesPerView: 2 },
                767: { slidesPerView: 3 },
                1024: { slidesPerView: 5 }
            }
        };
        this.store.dispatch(new Delete({}));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.scheduleDates = [];
        for (let i = 0; i < 7; i++) {
            this.scheduleDates.push(moment().add(i, 'day').format('YYYY-MM-DD'));
        }
        this.getTheaters();
    }

    public ngOnDestroy() {
        clearInterval(this.updateTimer);
    }

    private update() {
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setInterval(() => {
            this.purchase.subscribe((purchase) => {
                if (purchase.movieTheater === undefined) {
                    return;
                }
                this.selectTheater(purchase.movieTheater);
            }).unsubscribe();
        }, time);
    }

    /**
     * resize
     */
    public resize() {
        this.directiveRef.update();
    }

    /**
     * getTheaters
     */
    public getTheaters() {
        this.store.dispatch(new GetTheaters({ params: {} }));

        const success = this.actions.pipe(
            ofType(ActionTypes.GetTheatersSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    const movieTheater = purchase.movieTheaters[0];
                    this.selectTheater(movieTheater);
                    this.update();
                }).unsubscribe();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetTheatersFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * selectTheater
     */
    public selectTheater(movieTheater: factory.organization.movieTheater.IOrganization) {
        this.store.dispatch(new SelectTheater({ movieTheater }));
        setTimeout(() => {
            this.selectDate();
        }, 0);
    }

    /**
     * selectDate
     */
    public selectDate(scheduleDate?: string) {
        this.purchase.subscribe((purchase) => {
            const movieTheater = purchase.movieTheater;
            if (scheduleDate === undefined || scheduleDate === '') {
                scheduleDate = moment().format('YYYY-MM-DD');
            }
            if (movieTheater === undefined) {
                return;
            }
            this.store.dispatch(new GetSchedule({ movieTheater, scheduleDate }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.GetScheduleSuccess),
            tap(() => { })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetScheduleFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * selectSchedule
     */
    public selectSchedule(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        if (screeningEvent.remainingAttendeeCapacity === undefined
            || screeningEvent.remainingAttendeeCapacity === 0) {
            return;
        }
        this.store.dispatch(new SelectSchedule({ screeningEvent }));
        this.purchase.subscribe((purchase) => {
            if (purchase.movieTheater === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.store.dispatch(new StartTransaction({
                params: {
                    expires: moment().add(environment.TRANSACTION_TIME, 'minutes').toDate(),
                    seller: {
                        typeOf: purchase.movieTheater.typeOf,
                        id: purchase.movieTheater.id
                    },
                    object: {}
                }
            }));
        }).unsubscribe();


        const success = this.actions.pipe(
            ofType(ActionTypes.StartTransactionSuccess),
            tap(() => {
                this.router.navigate(['/purchase/seat']);
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.StartTransactionFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

}
