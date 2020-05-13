import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import {
    getExternalData,
    getRemainingSeatLength,
    IScreeningEventWork,
    screeningEvents2WorkEvents
} from '../../../../../../functions';
import { IReservation, Performance } from '../../../../../../models';
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
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public screeningWorkEvents: IScreeningEventWork[];
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
        private purchaseService: PurchaseService,
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
        this.screeningWorkEvents = [];
        this.purchaseService.unsettledDelete();
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
        const theater = purchase.theater;
        const scheduleDate = purchase.scheduleDate;
        const transaction = purchase.transaction;
        const external = getExternalData();
        if (theater === undefined
            || scheduleDate === undefined
            || transaction === undefined) {
            throw new Error('theater or scheduleDate or transaction undefined');
        }
        const screeningEvents = await this.masterService.getSchedule({
            superEvent: {
                ids: (external.superEventId === undefined) ? [] : [external.superEventId],
                locationBranchCodes: [theater.branchCode],
                workPerformedIdentifiers: (external.workPerformedId === undefined)
                    ? [] : [external.workPerformedId],
            },
            startFrom: moment(scheduleDate).toDate(),
            startThrough: moment(scheduleDate).add(1, 'day').toDate()
        });
        this.screeningWorkEvents = screeningEvents2WorkEvents({ screeningEvents });
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
        try {
            await this.purchaseService.getScreeningEvent(screeningEvent);
            this.screeningEventSeats = await this.purchaseService.getScreeningEventSeats();
            await this.purchaseService.getTicketList();
            await this.purchaseService.getScreen({
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
        const purchase = await this.purchaseService.getData();
        const screeningEvent = purchase.screeningEvent;
        const screeningEventTicketOffers = purchase.screeningEventTicketOffers;
        const screeningEventSeats = this.screeningEventSeats;
        const screen = purchase.screen;
        if (screeningEvent === undefined || screen === undefined) {
            return;
        }
        console.error('screen', screen);
        const performance = new Performance(screeningEvent);
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
                    reservations: IReservation[];
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
        reservations: IReservation[];
        additionalTicketText?: string;
    }) {
        const reservations = params.reservations;
        const additionalTicketText = params.additionalTicketText;
        try {
            const purchase = await this.purchaseService.getData();
            const limit = (purchase.screeningEvent === undefined
                || purchase.screeningEvent.offers === undefined
                || purchase.screeningEvent.offers.eligibleQuantity.maxValue === undefined)
                ? Number(this.environment.PURCHASE_ITEM_MAX_LENGTH)
                : purchase.screeningEvent.offers.eligibleQuantity.maxValue;
            if (reservations.length > limit) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        'purchase.event.ticket.alert.limit',
                        { value: limit }
                    )
                });
                return;
            }
            this.screeningEventSeats = await this.purchaseService.getScreeningEventSeats();
            if (purchase.screeningEvent !== undefined
                && new Performance(purchase.screeningEvent).isTicketedSeat()) {
                const remainingSeatLength = getRemainingSeatLength({
                    screeningEventSeats: this.screeningEventSeats,
                    screeningEvent: purchase.screeningEvent
                });
                if (remainingSeatLength < reservations.length) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant('purchase.event.ticket.alert.getScreeningEventSeats')
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
            await this.purchaseService.temporaryReservation({
                reservations,
                additionalTicketText,
                screeningEventSeats: this.screeningEventSeats
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('purchase.event.ticket.success.temporaryReservation')
            });
            this.purchaseService.unsettledDelete();
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
                await this.purchaseService.cancelTemporaryReservations(authorizeSeatReservations);
            }
        });
    }

}

