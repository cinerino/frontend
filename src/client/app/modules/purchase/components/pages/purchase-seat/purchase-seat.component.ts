import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-seat',
    template: ''
})
export class PurchaseSeatComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public environment = getEnvironment();
    public external = Functions.Util.getExternalData();
    public screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    public translateName: string;
    public reservationCount: number;
    public Number = Number;

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private translate: TranslateService,
        protected router: Router,
        protected actionService: ActionService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.translateName = (this.environment.VIEW_TYPE === 'cinema')
            ? 'purchase.cinema.seat' : 'purchase.event.seat';
        this.screeningEventSeats = [];
        this.reservationCount = 0;
        try {
            const { screeningEvent, reservations } = await this.actionService.purchase.getData();
            if (screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            this.reservationCount = reservations.length;
            await this.resetSeats();
            reservations.forEach(r => {
                if (r.seat === undefined) {
                    return;
                }
                this.selectSeat({ seat: r.seat, status: Models.Purchase.Screen.SeatStatus.Default });
            });
            await this.actionService.purchase.getScreen({
                branchCode: { $eq: screeningEvent.location.branchCode },
                containedInPlace: {
                    branchCode: { $eq: screeningEvent.superEvent.location.branchCode }
                }
            });
            this.screeningEventSeats = await this.actionService.purchase.getScreeningEventSeats();
            await this.actionService.purchase.getTicketList();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 座席選択
     */
    public async selectSeat(data: {
        seat: Models.Purchase.Reservation.IReservationSeat,
        status: Models.Purchase.Screen.SeatStatus
    }) {
        const purchase = await this.actionService.purchase.getData();
        if (data.status === Models.Purchase.Screen.SeatStatus.Default) {
            if (purchase.screeningEvent !== undefined
                && purchase.screeningEvent.offers !== undefined
                && purchase.screeningEvent.offers.eligibleQuantity.maxValue !== undefined
                && purchase.reservations.length >= purchase.screeningEvent.offers.eligibleQuantity.maxValue) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(
                        `${this.translateName}.alert.limit`,
                        { value: purchase.screeningEvent.offers.eligibleQuantity.maxValue }
                    )
                });
                return;
            }
            this.actionService.purchase.selectSeats([data.seat]);
        } else {
            this.actionService.purchase.cancelSeats([data.seat]);
        }
    }

    /**
     * 座席決定
     */
    public async onSubmit() {
        const { screeningEventTicketOffers, screen } = await this.actionService.purchase.getData();
        try {
            if (screeningEventTicketOffers.length === 0) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant(`${this.translateName}.alert.ticketNotfound`)
                });
                return;
            }
            if (screen !== undefined && screen.openSeatingAllowed) {
                // 自由席
                await this.selectOpenSeating();
            }
            const { reservations } = await this.actionService.purchase.getData();
            await this.actionService.purchase.temporaryReservation({
                reservations,
                screeningEventSeats: this.screeningEventSeats
            });
            const navigate = (this.environment.VIEW_TYPE === 'cinema')
                ? '/purchase/cinema/ticket'
                : '/purchase/event/ticket';
            this.router.navigate([navigate]);
        } catch (error) {
            if (screen !== undefined && screen.openSeatingAllowed) {
                // 自由席
                await this.resetSeats();
            }
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant(`${this.translateName}.alert.temporaryReservation`)
            });
        }
    }

    /**
     * 全席選択解除
     */
    public async resetSeats() {
        const seats: Models.Purchase.Reservation.IReservationSeat[] = [];
        const purchase = await this.actionService.purchase.getData();
        purchase.reservations.forEach((reservation) => {
            if (reservation.seat === undefined) {
                return;
            }
            seats.push(reservation.seat);
        });
        this.actionService.purchase.cancelSeats(seats);
    }

    /**
     * 自由席予約可能数計算
     */
    public remainingAttendeeCapacityValue(params: {
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    }) {
        const screeningEventSeats = params.screeningEventSeats;
        const screeningEvent = params.screeningEvent;
        const values = [];
        let limit = Number(this.environment.PURCHASE_ITEM_MAX_LENGTH);
        if (screeningEvent.offers !== undefined
            && screeningEvent.offers.eligibleQuantity.maxValue !== undefined
            && limit > screeningEvent.offers.eligibleQuantity.maxValue) {
            limit = screeningEvent.offers.eligibleQuantity.maxValue;
        }
        if (new Models.Purchase.Performance(screeningEvent).isTicketedSeat()) {
            // イベント全体の残席数計算
            const screeningEventLimit = Functions.Purchase.getRemainingSeatLength({
                screeningEventSeats, screeningEvent
            });
            if (limit > screeningEventLimit) {
                limit = screeningEventLimit;
            }
        }
        for (let i = 0; i < limit; i++) {
            values.push(i + 1);
        }
        return values;
    }

    /**
     * 自由席選択
     */
    public async selectOpenSeating() {
        const { reservations } = await this.actionService.purchase.getData();
        this.screeningEventSeats = await this.actionService.purchase.getScreeningEventSeats();
        const screeningEventSeats = this.screeningEventSeats;
        const seats = Functions.Purchase.getEmptySeat({ reservations, screeningEventSeats });
        await this.resetSeats();
        const selectSeats: Models.Purchase.Reservation.IReservationSeat[] = [];
        for (let i = 0; i < Number(this.reservationCount); i++) {
            selectSeats.push(seats[i]);
        }
        this.actionService.purchase.selectSeats(selectSeats);
    }
}
