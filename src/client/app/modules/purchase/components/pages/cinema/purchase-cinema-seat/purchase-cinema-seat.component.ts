import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/api-javascript-client';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../../environments/environment';
import { getEmptySeat, getExternalData, getRemainingSeatLength } from '../../../../../../functions';
import { IReservationSeat, Performance, SeatStatus } from '../../../../../../models';
import { PurchaseService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-purchase-cinema-seat',
    templateUrl: './purchase-cinema-seat.component.html',
    styleUrls: ['./purchase-cinema-seat.component.scss']
})
export class PurchaseCinemaSeatComponent implements OnInit {
    public purchase: Observable<reducers.IPurchaseState>;
    public user: Observable<reducers.IUserState>;
    public isLoading: Observable<boolean>;
    public environment = getEnvironment();
    public external = getExternalData();

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private utilService: UtilService,
        private translate: TranslateService,
        private purchaseService: PurchaseService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        try {
            const purchase = await this.purchaseService.getData();
            const screeningEvent = purchase.screeningEvent;
            if (screeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            await this.purchaseService.getScreen({
                branchCode: { $eq: screeningEvent.location.branchCode },
                containedInPlace: {
                    branchCode: { $eq: screeningEvent.superEvent.location.branchCode }
                }
            });
            await this.purchaseService.getScreeningEventOffers();
            await this.purchaseService.getScreenData({ screeningEvent });
            await this.purchaseService.getTicketList();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * 座席選択
     */
    public selectSeat(data: {
        seat: IReservationSeat,
        status: SeatStatus
    }) {
        this.purchase.subscribe((purchase) => {
            if (data.status === SeatStatus.Default) {
                if (purchase.screeningEvent !== undefined
                    && purchase.screeningEvent.offers !== undefined
                    && purchase.screeningEvent.offers.eligibleQuantity.maxValue !== undefined
                    && purchase.reservations.length >= purchase.screeningEvent.offers.eligibleQuantity.maxValue) {
                    this.utilService.openAlert({
                        title: this.translate.instant('common.error'),
                        body: this.translate.instant(
                            'purchase.cinema.seat.alert.limit',
                            { value: purchase.screeningEvent.offers.eligibleQuantity.maxValue }
                        )
                    });
                    return;
                }
                this.purchaseService.selectSeats([data.seat]);
            } else {
                this.purchaseService.cancelSeats([data.seat]);
            }
        }).unsubscribe();
    }

    /**
     * 座席決定
     */
    public async onSubmit() {
        try {
            const purchase = await this.purchaseService.getData();
            const reservations = purchase.reservations;
            if (reservations.length === 0) {
                this.utilService.openAlert({
                    title: this.translate.instant('common.error'),
                    body: this.translate.instant('purchase.cinema.seat.alert.unselected')
                });
                return;
            }
            await this.purchaseService.temporaryReservation({ reservations });
            this.router.navigate(['/purchase/cinema/ticket']);
        } catch (error) {
            console.error(error);
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('purchase.cinema.seat.alert.temporaryReservation')
            });
        }
    }

    /**
     * 全席選択解除
     */
    public async resetSeats() {
        const seats: IReservationSeat[] = [];
        const purchase = await this.purchaseService.getData();
        purchase.reservations.forEach((reservation) => {
            if (reservation.seat === undefined) {
                return;
            }
            seats.push(reservation.seat);
        });
        this.purchaseService.cancelSeats(seats);
    }

    /**
     * 自由席予約可能数計算
     */
    public remainingAttendeeCapacityValue(
        screeningEvent: factory.chevre.event.screeningEvent.IEvent,
        screeningEventOffers: factory.chevre.place.screeningRoomSection.IPlaceWithOffer[]
    ) {
        const values = [];
        let limit = Number(this.environment.PURCHASE_ITEM_MAX_LENGTH);
        if (screeningEvent.offers !== undefined
            && screeningEvent.offers.eligibleQuantity.maxValue !== undefined
            && limit > screeningEvent.offers.eligibleQuantity.maxValue) {
            limit = screeningEvent.offers.eligibleQuantity.maxValue;
        }
        if (new Performance(screeningEvent).isTicketedSeat()) {
            // イベント全体の残席数計算
            const screeningEventLimit = getRemainingSeatLength(screeningEventOffers, screeningEvent);
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
    public async selectOpenSeating(event: Event) {
        if (event.target === null) {
            return;
        }
        const purchaseData = await this.purchaseService.getData();
        const value = Number((<HTMLSelectElement>event.target).value);
        const reservations = purchaseData.reservations;
        const screeningEventOffers = purchaseData.screeningEventOffers;
        const seats = getEmptySeat({ reservations, screeningEventOffers });
        await this.resetSeats();
        const selectSeats: IReservationSeat[] = [];
        for (let i = 0; i < value; i++) {
            selectSeats.push(seats[i]);
        }
        this.purchaseService.selectSeats(selectSeats);
    }
}
