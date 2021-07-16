import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';
import {
    ActionService,
    MasterService,
    UtilService,
} from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-schedule',
    templateUrl: './purchase-cinema-schedule.component.html',
    styleUrls: ['./purchase-cinema-schedule.component.scss'],
})
export class PurchaseCinemaScheduleComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public firstScheduleDate: string;
    public scheduleDates: string[];
    public preScheduleDates: string[];
    public isPreSchedule: boolean;
    public screeningEventsGroup: Functions.Purchase.IScreeningEventsGroup[];
    public creativeWorks: factory.chevre.creativeWork.movie.ICreativeWork[];
    public contentRatingTypes: factory.chevre.categoryCode.ICategoryCode[];
    public moment: typeof moment = moment;
    public environment = getEnvironment();
    public external = Functions.Util.getExternalData();
    private updateTimer: any;
    public theaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    public swiperInstance: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private actionService: ActionService,
        private masterService: MasterService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        const swiperConfig: any = {
            spaceBetween: 2,
            slidesPerView: 7,
            freeMode: true,
            breakpoints: {
                320: { slidesPerView: 3 },
                767: { slidesPerView: 4 },
                1024: { slidesPerView: 7 },
            },
            navigation: {
                nextEl: '.schedule-slider .swiper-button-next',
                prevEl: '.schedule-slider .swiper-button-prev',
            },
        };
        this.swiperInstance = new (<any>window).Swiper(
            '.swiper-container',
            swiperConfig
        );
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.isPreSchedule = false;
        this.scheduleDates = [];
        this.preScheduleDates = [];
        this.screeningEventsGroup = [];
        this.creativeWorks = [];
        this.contentRatingTypes = [];
        this.theaters = [];
        try {
            this.contentRatingTypes =
                await this.masterService.searchCategoryCode({
                    categorySetIdentifier:
                        factory.chevre.categoryCode.CategorySetIdentifier
                            .ContentRatingType,
                });
            this.theaters = await this.masterService.searchMovieTheaters();
            if (this.theaters.length === 0) {
                throw new Error('theater notfound');
            }
            const purchase = await this.actionService.purchase.getData();
            const external = Functions.Util.getExternalData();
            let theater =
                purchase.theater === undefined
                    ? this.theaters[0]
                    : purchase.theater;
            const findResult = this.theaters.find((t) => {
                return (
                    external.theaterBranchCode !== undefined &&
                    t.branchCode === external.theaterBranchCode
                );
            });
            if (findResult !== undefined) {
                theater = findResult;
            }
            this.selectTheater(theater);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
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
        if (this.isPreSchedule) {
            this.scheduleDates = [];
            for (
                let i = 0;
                i < Number(this.environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH);
                i++
            ) {
                this.scheduleDates.push(
                    moment().add(i, 'day').format('YYYYMMDD')
                );
            }
        } else {
            this.scheduleDates = this.preScheduleDates;
        }
        this.selectDate();
        this.isPreSchedule = !this.isPreSchedule;
        this.swiperInstance.update();
    }

    /**
     * 更新
     */
    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(async () => {
            const purchase = await this.actionService.purchase.getData();
            if (purchase.theater === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.selectTheater(purchase.theater);
        }, time);
    }

    /**
     * リサイズ
     */
    public resize() {
        this.swiperInstance.update();
    }

    /**
     * 劇場選択
     */
    public async selectTheater(
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom
    ) {
        try {
            this.actionService.purchase.selectTheater(theater);
            this.scheduleDates = [];
            for (
                let i = 0;
                i < Number(this.environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH);
                i++
            ) {
                this.scheduleDates.push(
                    moment().add(i, 'day').format('YYYYMMDD')
                );
            }
            this.preScheduleDates = [];
            this.isPreSchedule = false;
            this.firstScheduleDate = await this.getFirstScheduleDate();
            this.preScheduleDates =
                await this.actionService.purchase.event.getPreScheduleDates();
            this.selectDate();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 日付選択
     */
    public async selectDate(scheduleDate?: string) {
        const { theater } = await this.actionService.purchase.getData();
        const external = Functions.Util.getExternalData();
        if (theater === undefined || this.scheduleDates.length === 0) {
            this.router.navigate(['/error']);
            return;
        }
        let first = false;
        if (scheduleDate === undefined) {
            first = true;
            scheduleDate = this.isPreSchedule
                ? this.scheduleDates[0]
                : this.firstScheduleDate;
            if (external.scheduleDate !== undefined) {
                scheduleDate = external.scheduleDate;
            }
        }
        this.actionService.purchase.selectScheduleDate(scheduleDate);
        try {
            this.creativeWorks = await this.masterService.searchMovies({
                offers: { availableFrom: moment(scheduleDate).toDate() },
            });
            const screeningEventSeries =
                this.environment.PURCHASE_SCHEDULE_SORT ===
                'screeningEventSeries'
                    ? await this.masterService.searchScreeningEventSeries({
                          location: {
                              branchCode: { $eq: theater.branchCode },
                          },
                          workPerformed: {
                              identifiers: this.creativeWorks.map(
                                  (c) => c.identifier
                              ),
                          },
                      })
                    : [];
            const screeningRooms =
                this.environment.PURCHASE_SCHEDULE_SORT === 'screen'
                    ? await this.masterService.searchScreeningRooms({
                          branchCode: { $eq: theater.branchCode },
                      })
                    : [];
            const screeningEvents =
                await this.masterService.searchScreeningEvent({
                    superEvent: {
                        ids:
                            external.superEventId === undefined
                                ? []
                                : [external.superEventId],
                        locationBranchCodes: [theater.branchCode],
                        workPerformedIdentifiers:
                            external.workPerformedId === undefined
                                ? []
                                : [external.workPerformedId],
                    },
                    startFrom: moment(scheduleDate).toDate(),
                    startThrough: moment(scheduleDate)
                        .add(1, 'day')
                        .add(-1, 'millisecond')
                        .toDate(),
                    screeningEventSeries,
                    screeningRooms,
                });
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            this.screeningEventsGroup =
                Functions.Purchase.screeningEvents2ScreeningEventSeries({
                    screeningEvents,
                    now,
                });
            this.update();
            if (first) {
                // 最初のパフォーマンスのある日付に移動
                const activeIndex = this.scheduleDates.findIndex(
                    (s) => s === this.firstScheduleDate
                );
                this.swiperInstance.update();
                this.swiperInstance.slideTo(activeIndex);
            }
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * パフォーマンス選択
     */
    public async selectSchedule(
        screeningEvent: factory.chevre.event.screeningEvent.IEvent
    ) {
        this.actionService.purchase.unsettledDelete();
        try {
            await this.actionService.purchase.event.getScreeningEvent(
                screeningEvent
            );
            if (screeningEvent.offers?.seller?.id === undefined) {
                throw new Error('screeningEvent.offers.seller.id undefined');
            }
            await this.actionService.purchase.getSeller({
                id: screeningEvent.offers.seller.id,
            });
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
            return;
        }
        const purchase = await this.actionService.purchase.getData();
        if (purchase.seller === undefined) {
            this.router.navigate(['/error']);
            return;
        }
        try {
            if (purchase.transaction !== undefined) {
                await this.actionService.purchase.transaction.cancel();
            }
            await this.actionService.purchase.transaction.start();
            this.router.navigate(['/purchase/cinema/seat']);
        } catch (error) {
            console.error(error);
            try {
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
            } catch (error2) {
                console.error(error2);
                this.router.navigate(['/error']);
            }
        }
    }

    /**
     * 初回上映日取得
     */
    public async getFirstScheduleDate() {
        try {
            const { theater } = await this.actionService.purchase.getData();
            if (theater === undefined || this.scheduleDates.length === 0) {
                throw new Error(
                    'theater === undefined || this.scheduleDates.length === 0'
                );
            }
            const today = moment(
                moment().format('YYYYMMDD'),
                'YYYYMMDD'
            ).toDate();
            const screeningEvents =
                await this.masterService.searchScreeningEvent({
                    superEvent: {
                        locationBranchCodes: [theater.branchCode],
                    },
                    startFrom: moment(today).toDate(),
                    startThrough: moment(today)
                        .add(
                            Number(
                                this.environment
                                    .PURCHASE_SCHEDULE_DISPLAY_LENGTH
                            ),
                            'day'
                        )
                        .add(-1, 'millisecond')
                        .toDate(),
                    pageing: false,
                });
            return screeningEvents.length > 0
                ? moment(screeningEvents[0].startDate).format('YYYYMMDD')
                : moment().format('YYYYMMDD');
        } catch (error) {
            throw error;
        }
    }

    /**
     * コンテンツ取得
     */
    public getCreativeWorks(identifier: string) {
        return this.creativeWorks.find((c) => c.identifier === identifier);
    }
}
