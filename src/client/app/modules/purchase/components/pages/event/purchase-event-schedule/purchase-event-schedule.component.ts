import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap';
import { BsDatepickerContainerComponent } from 'ngx-bootstrap/datepicker/themes/bs/bs-datepicker-container.component';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import { getExternalData, iOSDatepickerTapBugFix, IScreeningEventWork, screeningEvents2WorkEvents } from '../../../../../../functions';
import { MasterService, PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

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
    public isLoading: Observable<boolean>;
    public screeningWorkEvents: IScreeningEventWork[];
    public moment: typeof moment = moment;
    public scheduleDate: Date;
    public environment = getEnvironment();
    public bsValue: Date;
    public isSales: boolean;
    public external = getExternalData();
    private updateTimer: any;
    @ViewChild('datepicker', { static: true }) private datepicker: BsDatepickerDirective;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private purchaseService: PurchaseService,
        private masterService: MasterService,
        private localeService: BsLocaleService,
        private utilService: UtilService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.bsValue = moment().toDate();
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.screeningWorkEvents = [];
        this.isSales = true;
        try {
            if ((await this.purchaseService.getData()).transaction !== undefined) {
                await this.purchaseService.cancelTransaction();
            }
            if (this.scheduleDate === undefined) {
                const defaultDate = moment(moment().format('YYYYMMDD'))
                    .add(this.environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                    .toDate();
                const openDate = moment(this.environment.PURCHASE_SCHEDULE_OPEN_DATE).toDate();
                this.scheduleDate = defaultDate;
                const nowDate = moment().toDate();
                if (openDate > nowDate) {
                    this.scheduleDate = openDate;
                }
                const external = getExternalData();
                if (external.scheduleDate !== undefined) {
                    this.scheduleDate = moment(external.scheduleDate).toDate();
                }
            }
            await this.masterService.getTheaters();
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
        this.updateTimer = setTimeout(() => {
            this.purchase.subscribe((purchase) => {
                if (purchase.theater === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                this.selectTheater(purchase.theater);
            }).unsubscribe();
        }, time);
    }

    /**
     * デフォルトの劇場取得
     */
    private async getDefaultTheater() {
        const purchase = await this.purchaseService.getData();
        const master = await this.masterService.getData();
        let theater = (purchase.theater === undefined) ? master.theaters[0] : purchase.theater;
        const findResult = master.theaters.find((t) => {
            const external = getExternalData();
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
        this.purchaseService.selectTheater(theater);
        setTimeout(() => { this.selectDate(); }, 0);
    }

    /**
     * 日付選択
     */
    public async selectDate(date?: Date | null) {
        if (date !== undefined && date !== null) {
            this.scheduleDate = date;
        }
        const now = (await this.utilService.getServerTime()).date;
        const selectDate = moment(moment(this.scheduleDate).format('YYYYMMDD')).toDate();
        const salesStopDate = moment(moment().format('YYYYMMDD'))
            .add(this.environment.PURCHASE_SCHEDULE_SALES_DATE_VALUE,
                this.environment.PURCHASE_SCHEDULE_SALES_DATE_UNIT)
            .toDate();
        const openDate = moment(this.environment.PURCHASE_SCHEDULE_OPEN_DATE).toDate();
        this.isSales = (selectDate >= openDate && selectDate >= salesStopDate);
        if (this.isSales
            && this.environment.PURCHASE_SCHEDULE_SALES_STOP_TIME !== ''
            && moment(salesStopDate).unix() === moment(selectDate).unix()) {
            const salesStopTime = moment(this.environment.PURCHASE_SCHEDULE_SALES_STOP_TIME, 'HHmmss').format('HHmmss');
            this.isSales = (moment(now).format('HHmmss') < salesStopTime);
        }
        try {
            const purchase = await this.purchaseService.getData();
            const theater = purchase.theater;
            if (theater === undefined) {
                return;
            }
            const scheduleDate = moment(this.scheduleDate).format('YYYY-MM-DD');
            this.purchaseService.selectScheduleDate(scheduleDate);
            const external = getExternalData();
            await this.masterService.getSchedule({
                superEvent: {
                    ids: (external.superEventId === undefined)
                        ? [] : [external.superEventId],
                    locationBranchCodes: [theater.branchCode],
                    workPerformedIdentifiers: (external.workPerformedId === undefined)
                        ? [] : [external.workPerformedId],
                },
                startFrom: moment(scheduleDate).toDate(),
                startThrough: moment(scheduleDate).add(1, 'day').toDate()
            });
            const master = await this.masterService.getData();
            const screeningEvents = master.screeningEvents;
            this.screeningWorkEvents = screeningEvents2WorkEvents({ screeningEvents });
            this.update();
        } catch (error) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 次へ
     */
    public async onSubmit() {
        try {
            const screeningEvent = (await this.masterService.getData())
                .screeningEvents
                .find(s => s.offers !== undefined && s.offers.seller !== undefined && s.offers.seller.id !== undefined);
            if (screeningEvent === undefined
                || screeningEvent.offers === undefined
                || screeningEvent.offers.seller === undefined
                || screeningEvent.offers.seller.id === undefined) {
                throw new Error('screeningEvent.offers.seller === undefined');
            }
            await this.purchaseService.getSeller(screeningEvent.offers.seller.id);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
        try {
            const purchase = await this.purchaseService.getData();
            const transaction = purchase.transaction;
            if (transaction !== undefined) {
                await this.purchaseService.cancelTransaction();
            }
            await this.purchaseService.startTransaction();
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
            if (errorObject.status === BAD_REQUEST) {
                this.router.navigate(['/maintenance']);
                return;
            }
            this.router.navigate(['/error']);
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
        iOSDatepickerTapBugFix(container, [this.datepicker]);
    }

}
