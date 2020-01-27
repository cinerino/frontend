import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import {
    changeTicketCount,
    getExternalData,
    getRemainingSeatLength,
    getTicketPrice,
    IScreeningEventWork,
    isTicketedSeatScreeningEvent,
    screeningEventsToWorkEvents
} from '../../../../../../functions';
import { IReservationTicket } from '../../../../../../models';
import { MasterService, PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import {
    PurchaseEventTicketModalComponent
} from '../../../../../shared/components/parts/purchase/event/ticket-modal/ticket-modal.component';

@Component({
    selector: 'app-purchase-event-ticket',
    templateUrl: './purchase-event-ticket.component.html',
    styleUrls: ['./purchase-event-ticket.component.scss']
})
export class PurchaseEventTicketComponent implements OnInit, OnDestroy {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public screeningWorkEvents: IScreeningEventWork[];
    public moment: typeof moment = moment;
    public getTicketPrice = getTicketPrice;
    public changeTicketCount = changeTicketCount;
    public environment = getEnvironment();
    private updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private masterService: MasterService,
        private translate: TranslateService,
        private purchaseService: PurchaseService,
        private modal: BsModalService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.master = this.store.pipe(select(reducers.getMaster));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.screeningWorkEvents = [];
        try {
            await this.getSchedule();
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
            try {
                await this.getSchedule();
            } catch (error) {
                console.error(error);
                this.router.navigate(['/error']);
            }
        }, time);
    }

    /**
     * スケジュール取得
     */
    public async getSchedule() {
        const purchase = await this.purchaseService.getData();
        const seller = purchase.seller;
        const scheduleDate = purchase.scheduleDate;
        const transaction = purchase.transaction;
        const external = getExternalData();
        if (seller === undefined
            || scheduleDate === undefined
            || transaction === undefined) {
            throw new Error('seller or scheduleDate or transaction undefined');
        }
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
        this.screeningWorkEvents = screeningEventsToWorkEvents({ screeningEvents });
        this.update();
    }

    /**
     * パフォーマンス選択
     * @param screeningEvent
     */
    public async selectSchedule(screeningEvent: factory.event.screeningEvent.IEvent) {
        const purchase = await this.purchaseService.getData();
        if (purchase.authorizeSeatReservations.length > 0
            && !this.environment.PURCHASE_CART) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.ticket.alert.cart')
            });
            return;
        }
        this.purchaseService.selectSchedule(screeningEvent);
        try {
            await this.purchaseService.getScreeningEventOffers();
            await this.purchaseService.getTicketList();
            this.openTicketList();
        } catch (error) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: ''
            });
        }
    }

    /**
     * 券種一覧表示
     */
    private openTicketList() {
        this.purchase.subscribe((purchase) => {
            const screeningEvent = purchase.screeningEvent;
            const screeningEventTicketOffers = purchase.screeningEventTicketOffers;
            const screeningEventOffers = purchase.screeningEventOffers;
            this.modal.show(PurchaseEventTicketModalComponent, {
                initialState: {
                    screeningEventTicketOffers,
                    screeningEventOffers,
                    screeningEvent,
                    cb: (reservationTickets: IReservationTicket[]) => {
                        this.selectTicket(reservationTickets, screeningEvent);
                    }
                },
                class: 'modal-dialog-centered'
            });
        }).unsubscribe();
    }

    /**
     * 券種選択
     */
    private async selectTicket(
        reservationTickets: IReservationTicket[],
        screeningEvent?: factory.chevre.event.screeningEvent.IEvent
    ) {
        const limit = (screeningEvent === undefined
            || screeningEvent.offers === undefined
            || screeningEvent.offers.eligibleQuantity.maxValue === undefined)
            ? 0 : screeningEvent.offers.eligibleQuantity.maxValue;
        if (reservationTickets.length > limit) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant(
                    'purchase.event.ticket.alert.limit',
                    { value: limit }
                )
            });
            return;
        }
        try {
            await this.purchaseService.getScreeningEventOffers();
            const purchase = await this.purchaseService.getData();
            if (purchase.screeningEvent !== undefined
                && isTicketedSeatScreeningEvent(purchase.screeningEvent)) {
                const remainingSeatLength = getRemainingSeatLength(purchase.screeningEventOffers, purchase.screeningEvent);
                if (remainingSeatLength < reservationTickets.length) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('purchase.event.ticket.alert.getScreeningEventOffers')
                    });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: ''
            });
        }
        try {
            await this.purchaseService.temporaryReservationFreeSeat(reservationTickets);
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('purchase.event.ticket.success.temporaryReservation')
            });
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.ticket.alert.temporaryReservation')
            });
        }
    }

    /**
     * 券種確定
     */
    public async onSubmit() {
        const purchase = await this.purchaseService.getData();
        const authorizeSeatReservations = purchase.authorizeSeatReservations;
        // チケット未選択判定
        if (authorizeSeatReservations.length === 0) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.ticket.alert.unselected')
            });
            return;
        }
        // 単独購入可能作品判定
        if (this.isSinglePurchase({ name: 'alert', authorizeSeatReservations })) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.ticket.alert.single')
            });
            return;
        }
        if (this.isSinglePurchase({ name: 'confirm', authorizeSeatReservations })) {
            this.utilService.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('purchase.event.ticket.confirm.single'),
                cb: () => { this.router.navigate(['/purchase/input']); }
            });
            return;
        }
        // チケット枚数上限判定
        let itemCount = 0;
        authorizeSeatReservations.forEach(a => itemCount += a.object.acceptedOffer.length);
        if (itemCount > Number(this.environment.PURCHASE_ITEM_MAX_LENGTH)) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant(
                    'purchase.event.ticket.alert.limit',
                    { value: Number(this.environment.PURCHASE_ITEM_MAX_LENGTH) }
                )
            });
            return;
        }
        this.router.navigate(['/purchase/input']);
    }

    /**
     * 単独購入可能判定（警告 or 確認）
     */
    private isSinglePurchase(params: {
        name: 'alert' | 'confirm',
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
    }) {
        const authorizeSeatReservations = params.authorizeSeatReservations;
        const findResult = authorizeSeatReservations.find((a) => {
            if (a.object.event === undefined) {
                return false;
            }
            const workPerformed = a.object.event.workPerformed;
            if (workPerformed === undefined
                || workPerformed.additionalProperty === undefined) {
                return false;
            }
            const findPropertyResult = workPerformed.additionalProperty.find(p => p.name === params.name && p.value !== undefined);
            if (findPropertyResult === undefined) {
                return false;
            }
            const findWorkPerformedResult = authorizeSeatReservations.find((a2) => {
                return (a2.object.event !== undefined
                    && a2.object.event.workPerformed !== undefined
                    && a2.object.event.workPerformed.identifier === findPropertyResult.value);
            });
            return (findWorkPerformedResult === undefined);
        });

        return findResult;
    }

    /**
     * 座席の仮予約削除確認
     */
    public removeItem(authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('purchase.event.cart.confirm.cancel'),
            cb: async () => {
                const authorizeSeatReservations = [authorizeSeatReservation];
                await this.purchaseService.cancelTemporaryReservations(authorizeSeatReservations);
            }
        });
    }

}

