import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { BsDatepickerContainerComponent, BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Functions } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-event-schedule',
    templateUrl: './purchase-event-schedule.component.html',
    styleUrls: ['./purchase-event-schedule.component.scss']
})
export class PurchaseEventScheduleComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    public screeningEventsGroup: Functions.Purchase.IScreeningEventsGroup[];
    public moment: typeof moment = moment;
    public scheduleDate: Date;
    public environment = getEnvironment();
    public bsValue: Date;
    public isSales: boolean;
    public external = Functions.Util.getExternalData();
    private updateTimer: any;
    public theaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    @ViewChild('datepicker', { static: true }) private datepicker: BsDatepickerDirective;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
        private masterService: MasterService,
        private localeService: BsLocaleService,
        private utilService: UtilService,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.bsValue = moment().toDate();
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.screeningEventsGroup = [];
        this.isSales = true;
        try {
            const { transaction } = await this.actionService.purchase.getData();
            if (transaction !== undefined) {
                await this.actionService.purchase.cancelTransaction();
            }
            this.scheduleDate = moment(moment().format('YYYYMMDD'))
                .add(this.environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                .toDate();
            const external = Functions.Util.getExternalData();
            if (external.scheduleDate !== undefined) {
                this.scheduleDate = moment(external.scheduleDate).toDate();
            }
            this.theaters = await this.masterService.searchMovieTheaters();
            if (this.theaters.length === 0) {
                throw new Error('theater notfound');
            }
            const theater = await this.getDefaultTheater();
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
     * デフォルトの劇場取得
     */
    private async getDefaultTheater() {
        const purchase = await this.actionService.purchase.getData();
        let theater = (purchase.theater === undefined) ? this.theaters[0] : purchase.theater;
        const findResult = this.theaters.find((t) => {
            const external = Functions.Util.getExternalData();
            return (external.theaterBranchCode !== undefined && t.branchCode === external.theaterBranchCode);
        });
        if (findResult !== undefined) {
            theater = findResult;
        }
        return theater;
    }

    /**
     * 劇場選択
     */
    public async selectTheater(theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom) {
        this.actionService.purchase.selectTheater(theater);
        await this.selectDate(this.scheduleDate);
    }

    /**
     * 日付選択
     */
    public async selectDate(date?: Date | null) {
        if (date === undefined || date === null) {
            return;
        }
        this.scheduleDate = date;
        const now = (await this.utilService.getServerTime()).date;
        const selectDate = moment(moment(this.scheduleDate).format('YYYYMMDD')).toDate();
        const salesStopDate = moment(moment().format('YYYYMMDD'))
            .add(this.environment.PURCHASE_SCHEDULE_SALES_DATE_VALUE,
                this.environment.PURCHASE_SCHEDULE_SALES_DATE_UNIT)
            .toDate();
        this.isSales = (selectDate >= salesStopDate);
        if (this.isSales
            && this.environment.PURCHASE_SCHEDULE_SALES_STOP_TIME !== ''
            && moment(salesStopDate).unix() === moment(selectDate).unix()) {
            const salesStopTime = moment(this.environment.PURCHASE_SCHEDULE_SALES_STOP_TIME, 'HHmmss').format('HHmmss');
            this.isSales = (moment(now).format('HHmmss') < salesStopTime);
        }
        try {
            const purchase = await this.actionService.purchase.getData();
            const theater = purchase.theater;
            if (theater === undefined) {
                return;
            }
            const scheduleDate = moment(this.scheduleDate).format('YYYY-MM-DD');
            this.actionService.purchase.selectScheduleDate(scheduleDate);
            const external = Functions.Util.getExternalData();
            const creativeWorks = await this.masterService.searchMovies({
                offers: { availableFrom: moment(scheduleDate).toDate() }
            });
            const screeningEventSeries = (this.environment.PURCHASE_SCHEDULE_SORT === 'screeningEventSeries')
                ? await this.masterService.searchScreeningEventSeries({
                    location: {
                        branchCode: { $eq: theater.branchCode }
                    },
                    workPerformed: { identifiers: creativeWorks.map(c => c.identifier) }
                })
                : [];
            const screeningRooms = (this.environment.PURCHASE_SCHEDULE_SORT === 'screen')
                ? await this.masterService.searchScreeningRooms({
                    branchCode: { $eq: theater.branchCode }
                })
                : [];
            this.screeningEvents = await this.masterService.searchScreeningEvent({
                superEvent: {
                    ids: (external.superEventId === undefined)
                        ? [] : [external.superEventId],
                    locationBranchCodes: [theater.branchCode],
                    workPerformedIdentifiers: (external.workPerformedId === undefined)
                        ? [] : [external.workPerformedId],
                },
                startFrom: moment(scheduleDate).toDate(),
                startThrough: moment(scheduleDate).add(1, 'day').add(-1, 'millisecond').toDate(),
                creativeWorks,
                screeningEventSeries,
                screeningRooms
            });
            this.screeningEventsGroup =
                Functions.Purchase.screeningEvents2ScreeningEventSeries({ screeningEvents: this.screeningEvents });
            this.update();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 次へ
     */
    public async onSubmit() {
        try {
            const screeningEvent = this.screeningEvents
                .find(s => s.offers !== undefined && s.offers.seller !== undefined && s.offers.seller.id !== undefined);
            if (screeningEvent === undefined
                || screeningEvent.offers === undefined
                || screeningEvent.offers.seller === undefined
                || screeningEvent.offers.seller.id === undefined) {
                throw new Error('screeningEvent.offers.seller === undefined');
            }
            await this.actionService.purchase.getSeller(screeningEvent.offers.seller.id);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
        try {
            const purchase = await this.actionService.purchase.getData();
            const transaction = purchase.transaction;
            if (transaction !== undefined) {
                await this.actionService.purchase.cancelTransaction();
            }
            await this.actionService.purchase.startTransaction();
            this.router.navigate(['/purchase/event/ticket']);
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
     * Datepicker言語設定
     */
    public setDatePicker() {
        this.user.subscribe((user) => {
            this.localeService.use(user.language);
        }).unsubscribe();
    }

    /**
     * Datepicker開閉
     */
    public toggleDatepicker() {
        this.setDatePicker();
        this.datepicker.toggle();
    }

    /**
     * iOS bugfix（2回タップしないと選択できない）
     */
    public onShowPicker(container: BsDatepickerContainerComponent) {
        Functions.Util.iOSDatepickerTapBugFix(container, [this.datepicker]);
    }

}
