import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getEnvironment } from '../../environments/environment';
import { getExternalData } from '../functions';
import { IReservation, IReservationSeat } from '../models';
import { purchaseAction } from '../store/actions';
import * as reducers from '../store/reducers';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private actions: Actions,
        private utilService: UtilService
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
        this.store.dispatch(new purchaseAction.Delete());
    }

    /**
     * 一時データ削除
     */
    public unsettledDelete() {
        this.store.dispatch(new purchaseAction.UnsettledDelete());
    }

    /**
     * スケジュール日選択
     */
    public selectScheduleDate(scheduleDate: string) {
        this.store.dispatch(new purchaseAction.SelectScheduleDate({ scheduleDate }));
    }

    /**
     * 販売者選択
     */
    public selectSeller(
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>
    ) {
        this.store.dispatch(new purchaseAction.SelectSeller({ seller }));
    }

    /**
     * 劇場選択
     */
    public selectTheater(
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom
    ) {
        this.store.dispatch(new purchaseAction.SelectTheater({ theater }));
    }

    /**
     * 先行販売日取得
     */
    public getPreScheduleDates() {
        return new Promise<void>((resolve, reject) => {
            this.purchase.subscribe((purchase) => {
                if (purchase.theater === undefined) {
                    reject();
                    return;
                }
                const external = getExternalData();
                const theater = purchase.theater;
                this.store.dispatch(new purchaseAction.GetPreScheduleDates({
                    superEvent: {
                        ids: (external.superEventId === undefined) ? [] : [external.superEventId],
                        locationBranchCodes: (theater.branchCode === undefined) ? [] : [theater.branchCode],
                        workPerformedIdentifiers: (external.workPerformedId === undefined)
                            ? [] : [external.workPerformedId]
                    }
                }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetPreScheduleDatesSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetPreScheduleDatesFail),
                tap(() => {
                    reject();
                })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * イベント取得
     */
    public async getScreeningEvent(screeningEvent: factory.chevre.event.screeningEvent.IEvent) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new purchaseAction.GetScreeningEvent({ screeningEvent }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreeningEventSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreeningEventFail),
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
            if (purchase.seller === undefined) {
                reject();
                return;
            }
            const external = getExternalData();
            const linyId = (external.linyId === undefined) ? undefined : external.linyId;
            if (linyId !== undefined) {
                agent.identifier.push({ name: 'linyId', value: linyId });
            }
            this.store.dispatch(new purchaseAction.StartTransaction({
                expires: moment(now).add(this.environment.PURCHASE_TRANSACTION_TIME, 'minutes').toDate(),
                seller: { typeOf: purchase.seller.typeOf, id: purchase.seller.id },
                object: {},
                agent
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.StartTransactionSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.StartTransactionFail),
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
            this.store.dispatch(new purchaseAction.CancelTransaction({ transaction }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTransactionSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTransactionFail),
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
            this.store.dispatch(new purchaseAction.GetScreen(params));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreenSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreenFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 空席情報取得
     */
    public async getScreeningEventOffers() {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const screeningEvent = purchase.screeningEvent;
            if (screeningEvent === undefined) {
                reject();
                return;
            }
            this.store.dispatch(new purchaseAction.GetScreeningEventOffers({ screeningEvent }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreeningEventOffersSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetScreeningEventOffersFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 座席選択
     */
    public selectSeats(seats: IReservationSeat[]) {
        this.store.dispatch(new purchaseAction.SelectSeats({ seats }));
    }

    /**
     * 座席選択解除
     */
    public cancelSeats(seats: IReservationSeat[]) {
        this.store.dispatch(new purchaseAction.CancelSeats({ seats }));
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
            this.store.dispatch(new purchaseAction.GetTicketList({ screeningEvent, seller }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetTicketListSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.GetTicketListFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 券種選択
     */
    public selectTickets(reservations: IReservation[]) {
        this.store.dispatch(new purchaseAction.SelectTickets({ reservations }));
    }

    /**
     * 座席仮予約
     */
    public async temporaryReservation(params: {
        reservations: IReservation[];
        additionalTicketText?: string;
    }) {
        const additionalTicketText = params.additionalTicketText;
        const reservations = params.reservations;
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            const screeningEventOffers = purchase.screeningEventOffers;
            if (transaction === undefined || screeningEvent === undefined) {
                reject();
                return;
            }
            const authorizeSeatReservation = purchase.authorizeSeatReservation;
            this.store.dispatch(new purchaseAction.TemporaryReservation({
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
                screeningEventOffers,
                additionalTicketText
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.TemporaryReservationSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.TemporaryReservationFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 座席仮予約解除
     */
    public async cancelTemporaryReservations(
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
    ) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(new purchaseAction.CancelTemporaryReservations({ authorizeSeatReservations }));

            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess),
                tap(() => { resolve(); })
            );

            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CancelTemporaryReservationsFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * クレジットカード登録
     */
    public registerCreditCard(
        creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard
            | factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
            | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
            | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized
    ) {
        this.store.dispatch(new purchaseAction.RegisterCreditCard({ creditCard }));
    }

    /**
     * クレジットカード登録削除
     */
    public removeCreditCard() {
        this.store.dispatch(new purchaseAction.RemoveCreditCard());
    }

    /**
     * 連絡先登録
     */
    public async registerContact(profile: {
        givenName: string;
        familyName: string;
        telephone: string;
        email: string;
    }) {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const transaction = purchase.transaction;
            if (transaction === undefined) {
                reject();
                return;
            }
            this.store.dispatch(new purchaseAction.RegisterContact({ transaction, profile }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.RegisterContactSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.RegisterContactFail),
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
            this.store.dispatch(new purchaseAction.AuthorizeCreditCard({
                transaction: purchase.transaction,
                authorizeCreditCardPayment: purchase.authorizeCreditCardPayments[0],
                orderCount: purchase.orderCount,
                amount,
                method: '1',
                creditCard: purchase.creditCard
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.AuthorizeCreditCardSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.AuthorizeCreditCardFail),
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
            this.store.dispatch(new purchaseAction.AuthorizeMovieTicket({
                transaction: purchase.transaction,
                authorizeMovieTicketPayments: purchase.authorizeMovieTicketPayments,
                authorizeSeatReservations: purchase.authorizeSeatReservations,
                pendingMovieTickets: purchase.pendingMovieTickets,
                seller: purchase.seller
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.AuthorizeMovieTicketSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.AuthorizeMovieTicketFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * ムビチケ認証
     */
    public async checkMovieTicket(movieTicket: {
        code: string;
        password: string;
    }) {
        const purchase = await this.getData();
        return new Promise<void>((resolve, reject) => {
            const transaction = purchase.transaction;
            const screeningEvent = purchase.screeningEvent;
            const seller = purchase.seller;
            if (transaction === undefined
                || screeningEvent === undefined
                || seller === undefined) {
                reject();
                return;
            }
            this.store.dispatch(new purchaseAction.CheckMovieTicket({
                transaction,
                screeningEvent,
                movieTickets: [{
                    typeOf: factory.paymentMethodType.MovieTicket,
                    project: seller.project,
                    identifier: movieTicket.code, // 購入管理番号
                    accessCode: movieTicket.password // PINコード
                }]
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CheckMovieTicketSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CheckMovieTicketFail),
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
            if (purchase.transaction === undefined || purchase.seller === undefined) {
                reject();
                return;
            }
            const transaction = purchase.transaction;
            const authorizeSeatReservations = purchase.authorizeSeatReservations;
            const seller = purchase.seller;
            const external = getExternalData();
            const linyId = (external.linyId === undefined)
                ? undefined : external.linyId;
            this.store.dispatch(new purchaseAction.EndTransaction({
                transaction,
                authorizeSeatReservations,
                seller,
                language,
                linyId
            }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.EndTransactionSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.EndTransactionFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * GMOトークン作成
     */
    public async createGmoTokenObject(creditCard: {
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
                this.store.dispatch(new purchaseAction.CreateGmoTokenObject({ seller, creditCard }));
            }).unsubscribe();
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CreateGmoTokenObjectSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.CreateGmoTokenObjectFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 外部連携情報を購入情報へ変換
     */
    public async convertExternalToPurchase(eventId: string) {
        return new Promise((resolve, reject) => {
            this.store.dispatch(new purchaseAction.ConvertExternalToPurchase({ eventId }));
            const success = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.ConvertExternalToPurchaseSuccess),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(purchaseAction.ActionTypes.ConvertExternalToPurchaseFail),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }


}
