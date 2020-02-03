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
            await this.purchaseService.cancelTransaction();
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
            await this.masterService.getSellers();
            const seller = await this.getDefaultSeller();
            this.selectSeller(seller);
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
                if (purchase.seller === undefined) {
                    this.router.navigate(['/error']);
                    return;
                }
                this.selectSeller(purchase.seller);
            }).unsubscribe();
        }, time);
    }

    /**
     * デフォルトの販売者取得
     */
    private async getDefaultSeller() {
        return new Promise<factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>>((resolve) => {
            this.purchase.subscribe((purchase) => {
                this.master.subscribe((master) => {
                    let seller = (purchase.seller === undefined)
                        ? master.sellers[0] : purchase.seller;
                    const findResult = master.sellers.find((s) => {
                        const external = getExternalData();
                        return (external.theaterBranchCode !== undefined
                            && s.location !== undefined
                            && s.location.branchCode === external.theaterBranchCode);
                    });
                    if (findResult !== undefined) {
                        seller = findResult;
                    }
                    resolve(seller);
                }).unsubscribe();
            }).unsubscribe();
        });
    }

    /**
     * 販売者選択
     */
    public selectSeller(
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>
    ) {
        this.purchaseService.selectSeller(seller);
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
            const seller = purchase.seller;
            if (seller === undefined) {
                return;
            }
            const scheduleDate = moment(this.scheduleDate).format('YYYY-MM-DD');
            this.purchaseService.selectScheduleDate(scheduleDate);
            const external = getExternalData();
            await this.masterService.getSchedule({
                superEvent: {
                    ids: (external.superEventId === undefined)
                        ? [] : [external.superEventId],
                    locationBranchCodes: (seller.location === undefined || seller.location.branchCode === undefined)
                        ? [] : [seller.location.branchCode],
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
            await this.purchaseService.cancelTransaction();
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
