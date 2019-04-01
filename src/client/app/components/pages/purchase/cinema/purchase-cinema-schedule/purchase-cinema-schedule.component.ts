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
import { environment } from '../../../../../../environments/environment';
import { IScreeningEventWork, screeningEventsToWorkEvents } from '../../../../../functions';
import { masterAction, purchaseAction } from '../../../../../store/actions';
import * as reducers from '../../../../../store/reducers';
import { PurchaseTransactionModalComponent } from '../../../../parts';

@Component({
    selector: 'app-purchase-cinema-schedule',
    templateUrl: './purchase-cinema-schedule.component.html',
    styleUrls: ['./purchase-cinema-schedule.component.scss']
})
export class PurchaseCinemaScheduleComponent implements OnInit, OnDestroy {
    @ViewChild(SwiperComponent) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective) public directiveRef: SwiperDirective;
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public swiperConfig: SwiperConfigInterface;
    public scheduleDates: string[];
    public isPreSchedule: boolean;
    public screeningWorkEvents: IScreeningEventWork[];
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
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.isPreSchedule = false;
        this.scheduleDates = [];
        this.screeningWorkEvents = [];
        this.getSellers();
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
            if (purchase.seller === undefined) {
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
                if (purchase.seller === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                this.selectSeller(purchase.seller);
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
     * getSellers
     */
    public getSellers() {
        this.store.dispatch(new masterAction.GetSellers());
        const success = this.actions.pipe(
            ofType(masterAction.ActionTypes.GetSellersSuccess),
            tap(() => {
                this.purchase.subscribe((purchase) => {
                    this.master.subscribe((master) => {
                        let seller = (purchase.seller === undefined)
                            ? master.sellers[0] : purchase.seller;
                        const findResult = master.sellers.find((s) => {
                            return (purchase.external !== undefined
                                && purchase.external.sellerId !== undefined
                                && s.id === purchase.external.sellerId);
                        });
                        if (findResult !== undefined) {
                            seller = findResult;
                        }
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
            if (purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            const seller = purchase.seller;
            this.store.dispatch(new purchaseAction.GetPreScheduleDates({
                superEvent: {
                    ids:
                        (purchase.external === undefined || purchase.external.eventId === undefined) ? [] : [purchase.external.eventId],
                    locationBranchCodes:
                        (seller.location === undefined || seller.location.branchCode === undefined) ? [] : [seller.location.branchCode]
                }
            }));
        }).unsubscribe();

        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetPreScheduleDatesSuccess),
            tap(() => {
                this.isPreSchedule = false;
                this.selectDate();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.GetPreScheduleDatesFail),
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
            const seller = purchase.seller;
            if (seller === undefined || this.scheduleDates.length === 0) {
                this.router.navigate(['/error']);
                return;
            }
            if (scheduleDate === undefined || scheduleDate === '') {
                scheduleDate = this.scheduleDates[0];
            }
            this.store.dispatch(new purchaseAction.SelectScheduleDate({ scheduleDate }));
            this.store.dispatch(new masterAction.GetSchedule({
                superEvent: {
                    ids:
                        (purchase.external === undefined || purchase.external.eventId === undefined) ? [] : [purchase.external.eventId],
                    locationBranchCodes:
                        (seller.location === undefined || seller.location.branchCode === undefined) ? [] : [seller.location.branchCode]
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
     * selectSchedule
     */
    public selectSchedule(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        if (screeningEvent.remainingAttendeeCapacity === undefined
            || screeningEvent.remainingAttendeeCapacity === 0) {
            return;
        }
        this.store.dispatch(new purchaseAction.UnsettledDelete());
        this.store.dispatch(new purchaseAction.SelectSchedule({ screeningEvent }));
        this.purchase.subscribe((purchase) => {
            this.user.subscribe((user) => {
                if (purchase.seller === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }

                if (user.limitedPurchaseCount === 1) {
                    if (purchase.authorizeSeatReservations.length > 0) {
                        this.cancelTemporaryReservations();
                        return;
                    }
                }
                if (user.limitedPurchaseCount > 1
                    && purchase.transaction !== undefined
                    && purchase.authorizeSeatReservations.length > 0) {
                    this.openTransactionModal();
                    return;
                }
                this.startTransaction();
            }).unsubscribe();
        }).unsubscribe();
    }

    private cancelTemporaryReservations() {
        this.purchase.subscribe((purchase) => {
            if (purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }

            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));
        }).unsubscribe();


        const success = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
            tap(() => {
                this.startTransaction();
            })
        );

        const fail = this.actions.pipe(
            ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
            tap(() => {
                this.store.dispatch(new purchaseAction.UnsettledDelete());
                this.startTransaction();
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
                this.router.navigate(['/purchase/cinema/seat']);
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

    public openTransactionModal() {
        this.purchase.subscribe((purchase) => {
            this.user.subscribe((user) => {
                const modalRef = this.modal.open(PurchaseTransactionModalComponent, {
                    centered: true
                });
                modalRef.componentInstance.purchase = purchase;
                modalRef.componentInstance.user = user;
                modalRef.result.then(() => {
                    this.router.navigate(['/purchase/cinema/seat']);
                }).catch(() => { });
            }).unsubscribe();
        }).unsubscribe();
    }

}
