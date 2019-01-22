import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { SERVICE_UNAVAILABLE, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { IScreeningEventFilm, screeningEventsToFilmEvents } from '../../../../functions';
import {
    ActionTypes,
    GetPreScheduleDates,
    GetSchedule,
    GetTheaters,
    SelectSchedule,
    SelectTheater,
    StartTransaction,
    UnsettledDelete
} from '../../../../store/actions/purchase.action';
import * as reducers from '../../../../store/reducers';
import { PurchaseTransactionModalComponent } from '../../../parts/purchase-transaction-modal/purchase-transaction-modal.component';

@Component({
    selector: 'app-purchase-schedule',
    templateUrl: './purchase-schedule.component.html',
    styleUrls: ['./purchase-schedule.component.scss']
})
export class PurchaseScheduleComponent implements OnInit, OnDestroy {
    @ViewChild(SwiperComponent) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective) public directiveRef: SwiperDirective;
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public swiperConfig: SwiperConfigInterface;
    public scheduleDates: string[];
    public isPreSchedule: boolean;
    public screeningFilmEvents: IScreeningEventFilm[];
    public moment: typeof moment = moment;
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private modal: NgbModal
    ) { }

    public async ngOnInit() {
        this.swiperConfig = {
            spaceBetween: 1,
            slidesPerView: 7,
            freeMode: true,
            breakpoints: {
                320: { slidesPerView: 2 },
                767: { slidesPerView: 3 },
                1024: { slidesPerView: 5 }
            },
            navigation: {
                nextEl: '.schedule-slider .swiper-button-next',
                prevEl: '.schedule-slider .swiper-button-prev',
            },
        };
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
        this.isPreSchedule = false;
        this.scheduleDates = [];
        this.screeningFilmEvents = [];
        this.getTheaters();
    }

    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    public changeScheduleType() {
        this.purchase.subscribe((purchase) => {
            if (this.isPreSchedule) {
                this.scheduleDates = [];
                for (let i = 0; i < 7; i++) {
                    this.scheduleDates.push(moment().add(i, 'day').format('YYYY-MM-DD'));
                }
            } else {
                this.scheduleDates = purchase.preScheduleDates;
            }
            if (purchase.movieTheater === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.selectDate();
            this.isPreSchedule = !this.isPreSchedule;
            this.directiveRef.update();
        }).unsubscribe();

    }

    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(() => {
            this.purchase.subscribe((purchase) => {
                if (purchase.movieTheater === undefined) {
                    this.router.navigate(['/error']);
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
                    const movieTheater = (purchase.movieTheater === undefined)
                        ? purchase.movieTheaters[0]
                        : purchase.movieTheater;
                    this.selectTheater(movieTheater);
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
    public selectTheater(movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater>) {
        this.store.dispatch(new SelectTheater({ movieTheater }));
        this.scheduleDates = [];
        for (let i = 0; i < 7; i++) {
            this.scheduleDates.push(moment().add(i, 'day').format('YYYY-MM-DD'));
        }
        this.isPreSchedule = false;
        this.directiveRef.update();
        setTimeout(() => {
            this.getPreScheduleDates();
        }, 0);
    }

    /**
     * getPreScheduleDates
     */
    public getPreScheduleDates() {
        this.purchase.subscribe((purchase) => {
            if (purchase.movieTheater === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const movieTheater = purchase.movieTheater;
            this.store.dispatch(new GetPreScheduleDates({ movieTheater }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.GetPreScheduleDatesSuccess),
            tap(() => {
                this.isPreSchedule = false;
                this.selectDate();
            })
        );

        const fail = this.actions.pipe(
            ofType(ActionTypes.GetPreScheduleDatesFail),
            tap(() => {
                this.router.navigate(['/error']);
            })
        );
        race(success, fail).pipe(take(1)).subscribe();
    }

    /**
     * selectDate
     */
    public selectDate(scheduleDate?: string) {
        this.purchase.subscribe((purchase) => {
            const movieTheater = purchase.movieTheater;
            if (movieTheater === undefined || this.scheduleDates.length === 0) {
                this.router.navigate(['/error']);
                return;
            }
            if (scheduleDate === undefined || scheduleDate === '') {
                scheduleDate = this.scheduleDates[0];
            }
            this.store.dispatch(new GetSchedule({ movieTheater, scheduleDate }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(ActionTypes.GetScheduleSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    let screeningEvents = purchase.screeningEvents;
                    if (this.isPreSchedule) {
                        // TODO 本来いらないはず
                        screeningEvents = purchase.screeningEvents.filter((screeningEvent) => {
                            return (moment(screeningEvent.offers.validFrom).unix() < moment().unix()
                                && moment(screeningEvent.offers.validThrough).unix() > moment().unix());
                        });
                    }
                    this.screeningFilmEvents = screeningEventsToFilmEvents({ screeningEvents });
                    this.update();
                }).unsubscribe();
            })
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
            if (purchase.transaction !== undefined
                && purchase.authorizeSeatReservations.length > 0) {
                this.openTransactionModal(screeningEvent);
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

    public openTransactionModal(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        const modalRef = this.modal.open(PurchaseTransactionModalComponent, {
            centered: true
        });
        modalRef.result.then(() => {
            this.store.dispatch(new UnsettledDelete());
            this.store.dispatch(new SelectSchedule({ screeningEvent }));
            this.router.navigate(['/purchase/seat']);
        }).catch(() => { });
    }

}
