import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BAD_REQUEST, TOO_MANY_REQUESTS } from 'http-status';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import { getExternalData, IScreeningEventWork, screeningEvents2WorkEvents } from '../../../../../../functions';
import { MasterService, PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import {
    PurchaseTransactionModalComponent
} from '../../../../../shared/components/parts/purchase/transaction-modal/transaction-modal.component';

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
    public environment = getEnvironment();
    public external = getExternalData();
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private purchaseService: PurchaseService,
        private masterService: MasterService,
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
        try {
            await this.masterService.getSellers();
            const master = await this.masterService.getData();
            const purchase = await this.purchaseService.getData();
            const external = getExternalData();
            let seller = (purchase.seller === undefined)
                ? master.sellers[0] : purchase.seller;
            const findResult = master.sellers.find((s) => {
                return (external.theaterBranchCode !== undefined
                    && s.location !== undefined
                    && s.location.branchCode === external.theaterBranchCode);
            });
            if (findResult !== undefined) {
                seller = findResult;
            }
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
     * スケジュールの種類を変更
     */
    public async changeScheduleType() {
        const purchase = await this.purchaseService.getData();
        if (this.isPreSchedule) {
            this.scheduleDates = [];
            for (let i = 0; i < Number(this.environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH); i++) {
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
     * 販売者選択
     */
    public async selectSeller(seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>) {
        this.purchaseService.selectSeller(seller);
        this.scheduleDates = [];
        for (let i = 0; i < Number(this.environment.PURCHASE_SCHEDULE_DISPLAY_LENGTH); i++) {
            this.scheduleDates.push(moment().add(i, 'day').format('YYYYMMDD'));
        }
        this.isPreSchedule = false;
        this.directiveRef.update();
        try {
            await this.purchaseService.getPreScheduleDates();
            this.isPreSchedule = false;
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
        const purchase = await this.purchaseService.getData();
        const seller = purchase.seller;
        const external = getExternalData();
        if (seller === undefined || this.scheduleDates.length === 0) {
            this.router.navigate(['/error']);
            return;
        }
        if (scheduleDate === undefined || scheduleDate === '') {
            scheduleDate = (this.isPreSchedule)
                ? this.scheduleDates[0]
                : moment()
                    .add(this.environment.PURCHASE_SCHEDULE_DEFAULT_SELECTED_DATE, 'day')
                    .format('YYYYMMDD');
            if (external.scheduleDate !== undefined) {
                scheduleDate = external.scheduleDate;
            }
        }
        this.purchaseService.selectScheduleDate(scheduleDate);
        try {
            await this.masterService.getSchedule({
                superEvent: {
                    ids: (external.superEventId === undefined) ? [] : [external.superEventId],
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
            console.error(error);
            this.router.navigate(['/error']);
        }
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
        try {
            await this.purchaseService.getScreeningEvent(screeningEvent);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
            return;
        }
        const purchase = await this.purchaseService.getData();
        if (purchase.seller === undefined) {
            this.router.navigate(['/error']);
            return;
        }
        if (this.environment.PURCHASE_CART
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
