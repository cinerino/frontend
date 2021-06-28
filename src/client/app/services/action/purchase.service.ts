import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
import { purchaseAction } from '../../store/actions';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';
import { ActionEventService } from './purchase/event.service';
import { ActionPaymentService } from './purchase/payment.service';
import { ActionTransactionService } from './purchase/transaction.service';

@Injectable({
    providedIn: 'root',
})
export class ActionPurchaseService {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private cinerinoService: CinerinoService,
        public payment: ActionPaymentService,
        public event: ActionEventService,
        public transaction: ActionTransactionService
    ) {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 購入データ取得
     */
    public async getData() {
        return new Promise<reducers.IPurchaseState>((resolve) => {
            this.purchase
                .subscribe((purchase) => {
                    resolve(purchase);
                })
                .unsubscribe();
        });
    }

    /**
     * データ削除
     */
    public delete() {
        this.store.dispatch(purchaseAction.remove());
    }

    /**
     * 一時データ削除
     */
    public unsettledDelete() {
        this.store.dispatch(purchaseAction.unsettledDelete());
    }

    /**
     * スケジュール日選択
     */
    public selectScheduleDate(scheduleDate: string) {
        this.store.dispatch(
            purchaseAction.selectScheduleDate({ scheduleDate })
        );
    }

    /**
     * 販売者取得
     */
    public async getSeller(params: { id: string }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetSeller',
            });
            await this.cinerinoService.getServices();
            const { id } = params;
            const seller = await this.cinerinoService.seller.findById({ id });
            this.store.dispatch(purchaseAction.setSeller({ seller }));
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 劇場選択
     */
    public selectTheater(
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom
    ) {
        this.store.dispatch(purchaseAction.selectTheater({ theater }));
    }

    /**
     * スクリーン取得
     */
    public async getScreeningRoom(params: {
        limit?: number;
        page?: number;
        branchCode?: {
            $eq?: string;
        };
        containedInPlace?: {
            branchCode?: {
                $eq?: string;
            };
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningRoom',
            });
            await this.cinerinoService.getServices();
            const searchResult = (
                await this.cinerinoService.place.searchScreeningRooms(params)
            ).data;
            this.store.dispatch(
                purchaseAction.setScreeningRoom({
                    screeningRoom: searchResult[0],
                })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 座席選択
     */
    public selectSeats(seats: Models.Purchase.Reservation.IReservationSeat[]) {
        this.store.dispatch(purchaseAction.selectSeats({ seats }));
    }

    /**
     * 座席選択解除
     */
    public cancelSeats(seats: Models.Purchase.Reservation.IReservationSeat[]) {
        this.store.dispatch(purchaseAction.cancelSeats({ seats }));
    }

    /**
     * 券種選択
     */
    public selectTickets(
        reservations: Models.Purchase.Reservation.IReservation[]
    ) {
        this.store.dispatch(purchaseAction.selectTickets({ reservations }));
    }

    /**
     * クレジットカード登録
     */
    public registerCreditCard(
        creditCard:
            | factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized
    ) {
        this.store.dispatch(purchaseAction.registerCreditCard({ creditCard }));
    }

    /**
     * クレジットカード登録削除
     */
    public removeCreditCard() {
        this.store.dispatch(purchaseAction.removeCreditCard());
    }

    /**
     * 外部連携情報を購入情報へ変換
     */
    public async externalData2PurchaseData(params: { event: { id: string } }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.ExternalData2PurchaseData',
            });
            const { event } = params;
            await this.cinerinoService.getServices();
            const screeningEvent =
                await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>(
                    { id: event.id }
                );
            if (
                screeningEvent.offers === undefined ||
                screeningEvent.offers.seller === undefined ||
                screeningEvent.offers.seller.id === undefined
            ) {
                throw new Error('screeningEvent.offers.seller.id undefined');
            }
            const searchResult =
                await this.cinerinoService.place.searchMovieTheaters({
                    id: { $eq: screeningEvent.superEvent.location.id },
                });
            if (searchResult.data.length === 0) {
                throw new Error('searchMovieTheaters notfound');
            }
            const theater = searchResult.data[0];
            const seller = await this.cinerinoService.seller.findById({
                id: screeningEvent.offers.seller.id,
            });

            this.store.dispatch(
                purchaseAction.setExternalPurchaseData({
                    screeningEvent,
                    seller,
                    theater,
                })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
