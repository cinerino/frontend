import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Functions, Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
import { purchaseAction } from '../../store/actions';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root'
})
export class ActionPurchaseService {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private utilService: UtilService,
        private cinerinoService: CinerinoService
    ) {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 購入データ取得
     */
    public async getData() {
        return new Promise<reducers.IPurchaseState>((resolve) => {
            this.purchase.subscribe((purchase) => {
                resolve(purchase);
            }).unsubscribe();
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
        this.store.dispatch(purchaseAction.selectScheduleDate({ scheduleDate }));
    }

    /**
     * 販売者取得
     */
    public getSeller(id: string) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(purchaseAction.getSeller({ id }));
            const success = this.actions.pipe(
                ofType(purchaseAction.getSellerSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.getSellerFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
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
     * 先行販売日取得
     */
    public async getPreScheduleDates() {
        try {
            this.utilService.loadStart({ process: 'purchaseAction.GetPreScheduleDates' });
            const external = Functions.Util.getExternalData();
            const { theater } = await this.getData();
            if (theater === undefined
                || theater.offers === undefined
                || theater.offers.availabilityStartsGraceTime === undefined
                || theater.offers.availabilityStartsGraceTime.value === undefined
                || theater.offers.availabilityStartsGraceTime.unitCode === undefined
                || theater.offers.availabilityStartsGraceTime.unitCode === undefined) {
                this.utilService.loadEnd();
                return [];
            }
            const { value, unitCode } = theater.offers.availabilityStartsGraceTime;
            const availabilityStartsGraceTime: {
                value: number;
                unit: 'day' | 'year' | 'second'
            } = {
                value: value * -1 + 1,
                unit: (unitCode === factory.chevre.unitCode.Day) ? 'day'
                    : (unitCode === factory.chevre.unitCode.Ann) ? 'year'
                        : (unitCode === factory.chevre.unitCode.Sec) ? 'second'
                            : 'second'
            };
            const superEvent = {
                ids: (external.superEventId === undefined) ? [] : [external.superEventId],
                locationBranchCodes: (theater.branchCode === undefined) ? [] : [theater.branchCode],
                workPerformedIdentifiers: (external.workPerformedId === undefined)
                    ? [] : [external.workPerformedId]
            };
            await this.cinerinoService.getServices();
            const now = moment((await this.utilService.getServerTime()).date).toDate();
            const today = moment(moment().format('YYYYMMDD')).toDate();
            const limit = 100;
            let page = 1;
            let roop = true;
            let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] = [];
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [factory.chevre.eventStatusType.EventScheduled],
                    superEvent: superEvent,
                    startFrom: moment(today, 'YYYYMMDD')
                        .add(availabilityStartsGraceTime.value, availabilityStartsGraceTime.unit)
                        .toDate(),
                    offers: {
                        validFrom: now,
                        validThrough: now,
                        availableFrom: now,
                        availableThrough: now
                    }
                });
                screeningEvents = screeningEvents.concat(searchResult.data);
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            const sheduleDates: string[] = [];
            screeningEvents.forEach((screeningEvent) => {
                const date = moment(screeningEvent.startDate).format('YYYYMMDD');
                const findResult = sheduleDates.find(s => s === date);
                if (findResult === undefined) {
                    sheduleDates.push(date);
                }
            });
            this.utilService.loadEnd();
            return sheduleDates;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * イベント取得
     */
    public async getScreeningEvent(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(purchaseAction.getScreeningEvent({ screeningEvent }));
            const success = this.actions.pipe(
                ofType(purchaseAction.getScreeningEventSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.getScreeningEventFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 取引開始
     */
    public async startTransaction() {
        const environment = getEnvironment();
        const purchase = await this.getData();
        const now = (await this.utilService.getServerTime()).date;
        const agent = {
            identifier: [
                ...environment.PURCHASE_TRANSACTION_IDENTIFIER,
                { name: 'userAgent', value: (navigator && navigator.userAgent !== undefined) ? navigator.userAgent : '' },
                { name: 'appVersion', value: (navigator && navigator.appVersion !== undefined) ? navigator.appVersion : '' }
            ]
        };
        return new Promise<void>((resolve, reject) => {
            if (purchase.seller === undefined
                || purchase.seller.id === undefined) {
                reject();
                return;
            }
            const external = Functions.Util.getExternalData();
            const linyId = (external.linyId === undefined) ? undefined : external.linyId;
            if (linyId !== undefined) {
                agent.identifier.push({ name: 'linyId', value: linyId });
            }
            this.store.dispatch(purchaseAction.startTransaction({
                expires: moment(now).add(this.environment.PURCHASE_TRANSACTION_TIME, 'minutes').toDate(),
                seller: { typeOf: purchase.seller.typeOf, id: purchase.seller.id },
                object: {},
                agent
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.startTransactionSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.startTransactionFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 取引中止
     */
    public async cancelTransaction() {
        return new Promise<void>(async (resolve) => {
            const purchase = await this.getData();
            const transaction = purchase.transaction;
            if (transaction === undefined) {
                resolve();
                return;
            }
            this.store.dispatch(purchaseAction.cancelTransaction({ transaction }));
            const success = this.actions.pipe(
                ofType(purchaseAction.cancelTransactionSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.cancelTransactionFail.type),
                tap(() => { resolve(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * スクリーン取得
     */
    public getScreen(params: {
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
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(purchaseAction.getScreen(params));
            const success = this.actions.pipe(
                ofType(purchaseAction.getScreenSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.getScreenFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 空席情報取得
     */
    public async getScreeningEventSeats() {
        try {
            this.utilService.loadStart({ process: 'purchaseAction.GetScreeningEventSeats' });
            const purchase = await this.getData();
            if (purchase.screeningEvent === undefined) {
                throw new Error('purchase.screeningEvent === undefined');
            }
            const screeningEvent = purchase.screeningEvent;
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
            if (!new Models.Purchase.Performance({ screeningEvent }).isTicketedSeat()) {
                this.utilService.loadEnd();
                return result;
            }
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult = await this.cinerinoService.event.searchSeats({
                    event: { id: screeningEvent.id },
                    page,
                    limit
                });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            this.utilService.loadEnd();
            return result;
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
     * 券種一覧取得
     */
    public async getTicketList() {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const screeningEvent = purchase.screeningEvent;
            const seller = purchase.seller;
            if (screeningEvent === undefined || seller === undefined) {
                reject();
                return;
            }
            this.store.dispatch(purchaseAction.getTicketList({ screeningEvent, seller }));
            const success = this.actions.pipe(
                ofType(purchaseAction.getTicketListSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.getTicketListFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 券種選択
     */
    public selectTickets(reservations: Models.Purchase.Reservation.IReservation[]) {
        this.store.dispatch(purchaseAction.selectTickets({ reservations }));
    }

    /**
     * 座席仮予約
     */
    public async temporaryReservation(params: {
        reservations: Models.Purchase.Reservation.IReservation[];
        additionalTicketText?: string;
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    }) {
        const additionalTicketText = params.additionalTicketText;
        const reservations = params.reservations;
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            const screeningEventSeats = params.screeningEventSeats;
            if (transaction === undefined || screeningEvent === undefined) {
                reject();
                return;
            }
            const authorizeSeatReservation = purchase.authorizeSeatReservation;
            this.store.dispatch(purchaseAction.temporaryReservation({
                reservations: reservations.map((reservation) => {
                    return {
                        seat: reservation.seat,
                        ticket: (reservation.ticket === undefined)
                            ? { ticketOffer: purchase.screeningEventTicketOffers[0] }
                            : reservation.ticket
                    };
                }),
                transaction,
                screeningEvent,
                authorizeSeatReservation,
                screeningEventSeats,
                additionalTicketText
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.temporaryReservationSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(purchaseAction.temporaryReservationFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 座席仮予約解除
     */
    public async cancelTemporaryReservations(
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[]
    ) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(purchaseAction.cancelTemporaryReservations({ authorizeSeatReservations }));

            const success = this.actions.pipe(
                ofType(purchaseAction.cancelTemporaryReservationsSuccess.type),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(purchaseAction.cancelTemporaryReservationsFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード登録
     */
    public registerCreditCard(
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
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
     * 連絡先登録
     */
    public async registerContact(profile: factory.person.IProfile) {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const transaction = purchase.transaction;
            if (transaction === undefined) {
                reject();
                return;
            }
            this.store.dispatch(purchaseAction.registerContact({ transaction, profile }));
            const success = this.actions.pipe(
                ofType(purchaseAction.registerContactSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.registerContactFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード承認
     */
    public async authorizeCreditCard(amount: number) {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            if (purchase.transaction === undefined || purchase.creditCard === undefined) {
                reject();
                return;
            }
            this.store.dispatch(purchaseAction.authorizeCreditCard({
                transaction: purchase.transaction,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayments[0],
                orderCount: purchase.orderCount,
                amount,
                method: '1',
                creditCard: purchase.creditCard
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.authorizeCreditCardSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.authorizeCreditCardFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * ムビチケ承認
     */
    public async authorizeMovieTicket() {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            if (purchase.transaction === undefined
                || purchase.seller === undefined) {
                reject();
                return;
            }
            this.store.dispatch(purchaseAction.authorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayments: purchase.authorizeMovieTicketPayments,
                authorizeSeatReservations: purchase.authorizeSeatReservations,
                pendingMovieTickets: purchase.pendingMovieTickets,
                seller: purchase.seller
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.authorizeMovieTicketSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.authorizeMovieTicketFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * ムビチケ認証
     */
    public async checkMovieTicket(params: {
        movieTicket: {
            code: string;
            password: string;
        },
        paymentMethodType: factory.paymentMethodType
    }) {
        const movieTicket = params.movieTicket;
        const paymentMethodType = params.paymentMethodType;
        const { transaction, screeningEvent } = await this.getData();
        return new Promise<void>((resolve, reject) => {
            if (transaction === undefined
                || screeningEvent === undefined) {
                reject();
                return;
            }
            this.store.dispatch(purchaseAction.checkMovieTicket({
                transaction,
                screeningEvent,
                movieTickets: [{
                    typeOf: paymentMethodType,
                    identifier: movieTicket.code, // 購入管理番号
                    accessCode: movieTicket.password // PINコード
                }]
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.checkMovieTicketSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.checkMovieTicketFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 取引確定
     */
    public async endTransaction(params: {
        language: string;
    }) {
        const purchase = await this.getData();
        const language = params.language;
        return new Promise<void>((resolve, reject) => {
            if (purchase.transaction === undefined
                || purchase.seller === undefined
                || purchase.theater === undefined) {
                reject();
                return;
            }
            const transaction = purchase.transaction;
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            const seller = purchase.seller;
            const theater = purchase.theater;
            const external = Functions.Util.getExternalData();
            const linyId = (external.linyId === undefined)
                ? undefined : external.linyId;
            this.store.dispatch(purchaseAction.endTransaction({
                transaction,
                authorizeSeatReservations,
                seller,
                theater,
                language,
                linyId
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.endTransactionSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.endTransactionFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカードトークン作成
     */
    public async createCreditCardToken(creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    }) {
        return new Promise<void>((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                const seller = purchase.seller;
                if (seller === undefined) {
                    reject();
                    return;
                }
                this.store.dispatch(purchaseAction.createCreditCardToken({ seller, creditCard }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.createCreditCardTokenSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.createCreditCardTokenFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 外部連携情報を購入情報へ変換
     */
    public async convertExternalToPurchase(eventId: string) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(purchaseAction.convertExternalToPurchase({ eventId }));
            const success = this.actions.pipe(
                ofType(purchaseAction.convertExternalToPurchaseSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.convertExternalToPurchaseFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }


}
