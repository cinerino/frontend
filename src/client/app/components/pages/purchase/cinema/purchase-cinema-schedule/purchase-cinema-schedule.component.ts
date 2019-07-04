import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IScreeningEventWork, screeningEventsToWorkEvents } from '../../../../../functions';
import { PurchaseService, UtilService } from '../../../../../services';
import { masterAction } from '../../../../../store/actions';
import * as reducers from '../../../../../store/reducers';
import { PurchaseTransactionModalComponent } from '../../../../parts';

@Component({
    selector: 'app-purchase-cinema-schedule',
    templateUrl: './purchase-cinema-schedule.component.html',
    styleUrls: ['./purchase-cinema-schedule.component.scss']
})
export class PurchaseCinemaScheduleComponent implements OnInit, OnDestroy {
    @ViewChild(SwiperComponent, { static: false }) public componentRef: SwiperComponent;
    @ViewChild(SwiperDirective, { static: true }) public directiveRef: SwiperDirective;
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public swiperConfig: SwiperConfigInterface;
    public scheduleDates: string[];
    public isPreSchedule: boolean;
    public screeningWorkEvents: IScreeningEventWork[];
    public moment: typeof moment = moment;
    public environment = environment;
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private router: Router,
        private utilService: UtilService,
        private purchaseService: PurchaseService,
        private modal: BsModalService,
        private translate: TranslateService
    ) { }

    /**
     * 初期化
     */
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

    /**
     * 破棄
     */
    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    /**
     * スケジュールの種類を変更
     */
    public changeScheduleType() {
        this.purchase.subscribe((purchase) => {
            if (this.isPreSchedule) {
                this.scheduleDates = [];
                for (let i = 0; i < Number(environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH); i++) {
                    this.scheduleDates.push(moment().add(i, 'day').format('YYYYMMDD'));
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
     * リサイズ
     */
    public resize() {
        this.directiveRef.update();
    }

    /**
     * 販売者一覧取得
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
                                && purchase.external.theaterBranchCode !== undefined
                                && s.location !== undefined
                                && s.location.branchCode === purchase.external.theaterBranchCode);
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
     * 販売者選択
     */
    public selectSeller(seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>) {
        this.purchaseService.selectSeller(seller);
        this.scheduleDates = [];
        for (let i = 0; i < Number(environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH); i++) {
            this.scheduleDates.push(moment().add(i, 'day').format('YYYYMMDD'));
        }
        this.isPreSchedule = false;
        this.directiveRef.update();
        setTimeout(async () => {
            try {
                await this.purchaseService.getPreScheduleDates();
                this.isPreSchedule = false;
                this.selectDate();
            } catch (error) {
                console.error(error);
                this.router.navigate(['/error']);
            }
        }, 0);
    }

    /**
     * 日付選択
     */
    public async selectDate(scheduleDate?: string) {
        const purchase = await this.purchaseService.getPurchaseData();
        const seller = purchase.seller;
        if (seller === undefined || this.scheduleDates.length === 0) {
            this.router.navigate(['/error']);
            return;
        }
        if (scheduleDate === undefined || scheduleDate === '') {
            scheduleDate = (this.isPreSchedule)
                ? this.scheduleDates[0]
                : moment()
                    .add(environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                    .format('YYYYMMDD');
            if (purchase.external !== undefined
                && purchase.external.scheduleDate !== undefined) {
                scheduleDate = purchase.external.scheduleDate;
            }
        }
        this.purchaseService.selectScheduleDate(scheduleDate);
        this.store.dispatch(new masterAction.GetSchedule({
            superEvent: {
                ids: (purchase.external === undefined || purchase.external.superEventId === undefined)
                    ? [] : [purchase.external.superEventId],
                locationBranchCodes: (seller.location === undefined || seller.location.branchCode === undefined)
                    ? [] : [seller.location.branchCode],
                workPerformedIdentifiers: (purchase.external === undefined || purchase.external.workPerformedId === undefined)
                    ? [] : [purchase.external.workPerformedId],
            },
            startFrom: moment(scheduleDate).toDate(),
            startThrough: moment(scheduleDate).add(1, 'day').toDate()
        }));

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
     * パフォーマンス選択
     */
    public async selectSchedule(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        if (screeningEvent.remainingAttendeeCapacity === undefined
            || screeningEvent.remainingAttendeeCapacity === 0) {
            return;
        }
        if (screeningEvent.offers === undefined
            || screeningEvent.offers.itemOffered.serviceOutput === undefined
            || screeningEvent.offers.itemOffered.serviceOutput.reservedTicket === undefined
            || screeningEvent.offers.itemOffered.serviceOutput.reservedTicket.ticketedSeat === undefined) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.cinema.schedule.alert.ticketedSeat')
            });
            return;
        }
        this.purchaseService.unsettledDelete();
        this.purchaseService.selectSchedule(screeningEvent);
        const purchase = await this.purchaseService.getPurchaseData();
        this.user.subscribe(async (user) => {
            if (purchase.seller === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            if (user.isPurchaseCart
                && purchase.transaction !== undefined
                && purchase.authorizeSeatReservations.length > 0) {
                this.openTransactionModal();
                return;
            }
            try {
                await this.purchaseService.cancelTransaction();
                await this.purchaseService.startTransaction();
                this.router.navigate(['/purchase/cinema/seat']);
            } catch (error) {
                if (error === null) {
                    throw new Error('error is null');
                }
                const errorObject = JSON.parse(error);
                if (errorObject.status === TOO_MANY_REQUESTS) {
                    this.router.navigate(['/congestion']);
                    return;
                }
                if (errorObject.status === BAD_REQUEST) {
                    this.router.navigate(['/maintenance']);
                    return;
                }
                this.router.navigate(['/error']);
            }
        }).unsubscribe();
    }

    /**
     * 取引重複警告
     */
    public openTransactionModal() {
        this.purchase.subscribe((purchase) => {
            this.user.subscribe((user) => {
                this.modal.show(PurchaseTransactionModalComponent, {
                    initialState: {
                        purchase, user,
                        cb: () => {
                            this.router.navigate(['/purchase/cinema/seat']);
                        }
                    },
                    class: 'modal-dialog-centered'
                });
            }).unsubscribe();
        }).unsubscribe();
    }

}
