import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';
import {
    PurchaseEventTicketModalComponent
} from '../../../../../shared/components/parts/purchase/event/ticket-modal/ticket-modal.component';

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
    public screeningEventsGroup: Functions.Purchase.IScreeningEventsGroup[];
    public moment: typeof moment = moment;
    public environment = getEnvironment();
    private updateTimer: any;
    public screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private masterService: MasterService,
        private translate: TranslateService,
        private actionService: ActionService,
        private modal: BsModalService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.screeningEventsGroup = [];
        this.actionService.purchase.unsettledDelete();
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
        const purchase = await this.actionService.purchase.getData();
        const theater = purchase.theater;
        const scheduleDate = purchase.scheduleDate;
        const transaction = purchase.transaction;
        const external = Functions.Util.getExternalData();
        if (theater === undefined
            || scheduleDate === undefined
            || transaction === undefined) {
            throw new Error('theater or scheduleDate or transaction undefined');
        }
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
        const screeningEvents = await this.masterService.searchScreeningEvent({
            superEvent: {
                ids: (external.superEventId === undefined) ? [] : [external.superEventId],
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
        this.screeningEventsGroup = Functions.Purchase.screeningEvents2ScreeningEventSeries({ screeningEvents });
        this.update();
    }

    /**
     * パフォーマンス選択
     * @param screeningEvent
     */
    public async selectSchedule(screeningEvent: factory.event.screeningEvent.IEvent) {
        const purchase = await this.actionService.purchase.getData();
        if (purchase.authorizeSeatReservations.length > 0
            && Number(this.environment.PURCHASE_ITEM_MAX_LENGTH) === 1) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.schedule.alert.cart')
            });
            return;
        }
        try {
            await this.actionService.purchase.getScreeningEvent(screeningEvent);
            this.screeningEventSeats = await this.actionService.purchase.getScreeningEventSeats();
            await this.actionService.purchase.getTicketList();
            await this.actionService.purchase.getScreen({
                branchCode: { $eq: screeningEvent.location.branchCode },
                containedInPlace: {
                    branchCode: { $eq: screeningEvent.superEvent.location.branchCode }
                }
            });
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
    private async openTicketList() {
        const purchase = await this.actionService.purchase.getData();
        const screeningEvent = purchase.screeningEvent;
        const screeningEventTicketOffers = purchase.screeningEventTicketOffers;
        const screeningEventSeats = this.screeningEventSeats;
        const screen = purchase.screen;
        if (screeningEvent === undefined || screen === undefined) {
            return;
        }
        const performance = new Models.Purchase.Performance(screeningEvent);
        if (!performance.isInfinitetock()
            && !screen.openSeatingAllowed
            && performance.isTicketedSeat()) {
            // 座席選択あり
            this.router.navigate(['/purchase/event/seat']);
            return;
        }
        this.modal.show(PurchaseEventTicketModalComponent, {
            class: 'modal-dialog-centered modal-lg',
            backdrop: 'static',
            initialState: {
                screeningEventTicketOffers,
                screeningEventSeats,
                screeningEvent,
                cb: (params: {
                    reservations: Models.Purchase.Reservation.IReservation[];
                    additionalTicketText?: string;
                }) => {
                    this.selectTicket(params);
                }
            }
        });
    }

    /**
     * 券種選択
     */
    private async selectTicket(params: {
        reservations: Models.Purchase.Reservation.IReservation[];
        additionalTicketText?: string;
    }) {
        const reservations = params.reservations;
        const additionalTicketText = params.additionalTicketText;
        try {
            const purchase = await this.actionService.purchase.getData();
            const limit = (purchase.screeningEvent === undefined
                || purchase.screeningEvent.offers === undefined
                || purchase.screeningEvent.offers.eligibleQuantity.maxValue === undefined)
                ? Number(this.environment.PURCHASE_ITEM_MAX_LENGTH)
                : purchase.screeningEvent.offers.eligibleQuantity.maxValue;
            if (reservations.length > limit) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.event.schedule.alert.limit',
                        { value: limit }
                    )
                });
                return;
            }
            this.screeningEventSeats = await this.actionService.purchase.getScreeningEventSeats();
            if (purchase.screeningEvent !== undefined
                && new Models.Purchase.Performance(purchase.screeningEvent).isTicketedSeat()) {
                const remainingSeatLength = Functions.Purchase.getRemainingSeatLength({
                    screeningEventSeats: this.screeningEventSeats,
                    screeningEvent: purchase.screeningEvent
                });
                if (remainingSeatLength < reservations.length) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('purchase.event.schedule.alert.getScreeningEventSeats')
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
            await this.actionService.purchase.temporaryReservation({
                reservations,
                additionalTicketText,
                screeningEventSeats: this.screeningEventSeats
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('purchase.event.schedule.success.temporaryReservation')
            });
            this.actionService.purchase.unsettledDelete();
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.schedule.alert.temporaryReservation')
            });
        }
    }

    /**
     * 券種確定
     */
    public async onSubmit() {
        const { authorizeSeatReservations } = await this.actionService.purchase.getData();
        // 単独購入可能作品判定
        if (this.isSinglePurchase({ name: 'alert', authorizeSeatReservations })) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.event.schedule.alert.single')
            });
            return;
        }
        if (this.isSinglePurchase({ name: 'confirm', authorizeSeatReservations })) {
            this.utilService.openConfirm({
                title: this.translate.instant('common.confirm'),
                body: this.translate.instant('purchase.event.schedule.confirm.single'),
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
                    'purchase.event.schedule.alert.limit',
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
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[]
    }) {
        const authorizeSeatReservations = params.authorizeSeatReservations;
        const findResult = authorizeSeatReservations.find((a) => {
            if (a.result === undefined
                || a.result.responseBody.object.reservations === undefined
                || a.result.responseBody.object.reservations[0].additionalProperty === undefined) {
                return false;
            }
            const findPropertyResult = a.result.responseBody.object.reservations[0].additionalProperty
                .find(p => p.name === params.name && p.value !== undefined);
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
    public removeItem(
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>) {
        this.utilService.openConfirm({
            title: this.translate.instant('common.confirm'),
            body: this.translate.instant('purchase.event.cart.confirm.cancel'),
            cb: async () => {
                const authorizeSeatReservations = [authorizeSeatReservation];
                await this.actionService.purchase.cancelTemporaryReservations(authorizeSeatReservations);
            }
        });
    }

}

