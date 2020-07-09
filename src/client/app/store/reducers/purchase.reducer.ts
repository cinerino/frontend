import { factory } from '@cinerino/api-javascript-client';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { Functions, Models } from '../..';
import { purchaseAction } from '../actions';

export interface IPurchaseState {
    /**
     * 販売者
     */
    seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    /**
     * 劇場
     */
    theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    /**
     * イベント
     */
    screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    /**
     * スケジュール日付
     */
    scheduleDate?: string;
    /**
     * 先行販売スケジュール
     */
    preScheduleDates: string[];
    /**
     * 取引
     */
    transaction?: factory.transaction.placeOrder.ITransaction;
    /**
     * スクリーン
     */
    screen?: factory.chevre.place.screeningRoom.IPlace;
    /**
     * 予約
     */
    reservations: Models.Purchase.Reservation.IReservation[];
    /**
     * 券種
     */
    screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    /**
     * 座席予約
     */
    authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>;
    /**
     * 座席予約リスト
     */
    authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    /**
     * プロフィール
     */
    profile?: factory.person.IProfile;
    /**
     * クレジットカード決済
     */
    authorizeCreditCardPayments: factory.action.authorize.paymentMethod.creditCard.IAction[];
    /**
     * ムビチケ決済
     */
    authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[];
    /**
     * クレジットカード
     */
    creditCard?:
    factory.paymentMethod.paymentCard.creditCard.ICheckedCard |
    factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember |
    factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw |
    factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
    /**
     * オーダーカウント
     */
    orderCount: number;
    /**
     * 注文
     */
    order?: factory.order.IOrder;
    /**
     * ムビチケ認証情報リスト
     */
    checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    /**
     * ムビチケ認証情報
     */
    checkMovieTicketAction?: factory.action.check.paymentMethod.movieTicket.IAction;
    /**
     * ムビチケ使用判定
     */
    isUsedMovieTicket: boolean;
    /**
     * 使用中ムビチケ
     */
    pendingMovieTickets: Models.Purchase.MovieTicket.IMovieTicket[];
}

export const purchaseInitialState: IPurchaseState = {
    preScheduleDates: [],
    reservations: [],
    screeningEventTicketOffers: [],
    orderCount: 0,
    authorizeSeatReservations: [],
    checkMovieTicketActions: [],
    authorizeCreditCardPayments: [],
    authorizeMovieTicketPayments: [],
    isUsedMovieTicket: false,
    pendingMovieTickets: []
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(purchaseAction.remove, state => {
            return {
                ...state,
                purchaseData: {
                    reservations: [],
                    screeningEvent: undefined,
                    screeningEventTicketOffers: [],
                    authorizeSeatReservation: undefined,
                    checkMovieTicketAction: undefined,
                    isUsedMovieTicket: false,
                    pendingMovieTickets: [],
                    orderCount: 0,
                    authorizeCreditCardPayments: [],
                    authorizeMovieTicketPayments: [],
                    checkMovieTicketActions: [],
                    authorizeSeatReservations: [],
                    preScheduleDates: [],
                }
            };
        }),
        on(purchaseAction.unsettledDelete, state => {
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    reservations: [],
                    screeningEvent: undefined,
                    screeningEventTicketOffers: [],
                    authorizeSeatReservation: undefined,
                    checkMovieTicketAction: undefined,
                    isUsedMovieTicket: false,
                }
            };
        }),
        on(purchaseAction.getSeller, (state) => {
            return { ...state, loading: false, process: 'purchaseAction.GetSeller' };
        }),
        on(purchaseAction.getSellerSuccess, (state, payload) => {
            const seller = payload.seller;
            return { ...state, purchaseData: { ...state.purchaseData, seller }, loading: false, process: '', error: null };
        }),
        on(purchaseAction.getSellerFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.selectTheater, (state, payload) => {
            const theater = payload.theater;
            return { ...state, purchaseData: { ...state.purchaseData, theater }, loading: false, process: '', error: null };
        }),
        on(purchaseAction.selectScheduleDate, (state, payload) => {
            const scheduleDate = payload.scheduleDate;
            return { ...state, purchaseData: { ...state.purchaseData, scheduleDate }, loading: true, process: '', error: null };
        }),
        on(purchaseAction.getPreScheduleDates, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.GetPreScheduleDates' };
        }),
        on(purchaseAction.getPreScheduleDatesSuccess, (state, payload) => {
            const preScheduleDates = payload.sheduleDates;
            return { ...state, purchaseData: { ...state.purchaseData, preScheduleDates }, loading: false, process: '', error: null };
        }),
        on(purchaseAction.getPreScheduleDatesFail, (state, payload) => {
            const error = payload.error;
            return { ...state, error: (error.message) ? error.message :  JSON.stringify(error), loading: false, process: '' };
        }),
        on(purchaseAction.getScreeningEvent, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.GetScreeningEvent' };
        }),
        on(purchaseAction.getScreeningEventSuccess, (state, payload) => {
            const screeningEvent = payload.screeningEvent;
            return { ...state, purchaseData: { ...state.purchaseData, screeningEvent }, loading: false, process: '', error: null };
        }),
        on(purchaseAction.getScreeningEventFail, (state, payload) => {
            const error = payload.error;
            return { ...state, error: (error.message) ? error.message :  JSON.stringify(error), loading: false, process: '' };
        }),
        on(purchaseAction.startTransaction, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.StartTransaction' };
        }),
        on(purchaseAction.startTransactionSuccess, (state, payload) => {
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    transaction: payload.transaction,
                    preScheduleDates: [],
                    authorizeSeatReservations: [],
                    authorizeCreditCardPayments: [],
                    authorizeMovieTicketPayments: [],
                    checkMovieTicketActions: [],
                    pendingMovieTickets: [],
                    profile: undefined,
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.getScreeningEventFail, (state, payload) => {
            const error = payload.error;
            return { ...state, error: (error.message) ? error.message :  JSON.stringify(error), loading: false, process: '' };
        }),
        on(purchaseAction.cancelTransaction, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.CancelTransaction' };
        }),
        on(purchaseAction.cancelTransactionSuccess, (state) => {
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    transaction: undefined,
                    preScheduleDates: [],
                    authorizeSeatReservations: [],
                    authorizeCreditCardPayments: [],
                    authorizeMovieTicketPayments: [],
                    checkMovieTicketActions: [],
                    pendingMovieTickets: [],
                    profile: undefined,
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.cancelTransactionFail, (state, payload) => {
            const error = payload.error;
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    transaction: undefined,
                    preScheduleDates: [],
                    authorizeSeatReservations: [],
                    authorizeCreditCardPayments: [],
                    authorizeMovieTicketPayments: [],
                    checkMovieTicketActions: [],
                    pendingMovieTickets: [],
                    profile: undefined,
                }, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error)
            };
        }),
        on(purchaseAction.getScreen, (state) => {
            const screen = undefined;
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    screen
                }, loading: true, process: 'purchaseAction.GetScreen'
            };
        }),
        on(purchaseAction.getScreenSuccess, (state, payload) => {
            const screen = payload.screen;
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    screen
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.getScreenFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.selectSeats, (state, payload) => {
            const reservations = Functions.Util.deepCopy<Models.Purchase.Reservation.IReservation[]>(state.purchaseData.reservations);
            payload.seats.forEach((seat) => {
                reservations.push({ seat });
            });
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    reservations
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.cancelSeats, (state, payload) => {
            const reservations: Models.Purchase.Reservation.IReservation[] = [];
            const seats = payload.seats;
            state.purchaseData.reservations.forEach((reservation) => {
                const findResult = seats.find((seat) => {
                    return (reservation.seat !== undefined
                        && reservation.seat.seatNumber === seat.seatNumber
                        && reservation.seat.seatSection === seat.seatSection);
                });
                if (findResult === undefined) {
                    reservations.push(reservation);
                }
            });
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    reservations
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.getTicketList, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.GetTicketList' };
        }),
        on(purchaseAction.getTicketListSuccess, (state, payload) => {
            const screeningEventTicketOffers = payload.screeningEventTicketOffers;
            const movieTicketTypeOffers = Functions.Purchase.getMovieTicketTypeOffers({screeningEventTicketOffers});
            const isUsedMovieTicket = (movieTicketTypeOffers.length > 0);
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    screeningEventTicketOffers,
                    movieTicketTypeOffers,
                    isUsedMovieTicket
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.getTicketListFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.selectTickets, (state, payload) => {
            const reservations: Models.Purchase.Reservation.IReservation[] = [];
            const selectedReservations = payload.reservations;
            state.purchaseData.reservations.forEach((reservation) => {
                const findResult =
                    selectedReservations.find(r => {
                        return (reservation.seat?.seatNumber === r.seat?.seatNumber
                            && reservation.seat?.seatRow === r.seat?.seatRow
                            && reservation.seat?.seatSection === r.seat?.seatSection);
                    });
                if (findResult === undefined) {
                    reservations.push(reservation);
                } else {
                    reservations.push(findResult);
                }
            });
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    reservations
                }
            };
        }),
        on(purchaseAction.temporaryReservation, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.TemporaryReservation' };
        }),
        on(purchaseAction.temporaryReservationSuccess, (state, payload) => {
            const authorizeSeatReservation =
                Functions.Util.deepCopy<factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>>
                    (payload.addAuthorizeSeatReservation);
            const removeAuthorizeSeatReservation = payload.removeAuthorizeSeatReservation;
            const reservations = Functions.Util.deepCopy<Models.Purchase.Reservation.IReservation[]>(state.purchaseData.reservations);
            const authorizeSeatReservations =
                Functions.Util.deepCopy<factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[]>
                    (state.purchaseData.authorizeSeatReservations);
            const pendingMovieTickets =
                Functions.Util.deepCopy<Models.Purchase.MovieTicket.IMovieTicket[]>(state.purchaseData.pendingMovieTickets);
            if (removeAuthorizeSeatReservation !== undefined) {
                // 削除
                const findAuthorizeSeatReservation =
                    authorizeSeatReservations.findIndex(r => r.id === removeAuthorizeSeatReservation.id);
                if (findAuthorizeSeatReservation > -1) {
                    authorizeSeatReservations.splice(findAuthorizeSeatReservation, 1);
                }
                const findPendingMovieTicket =
                    pendingMovieTickets.findIndex(t => t.id === removeAuthorizeSeatReservation.id);
                if (findPendingMovieTicket > -1) {
                    pendingMovieTickets.splice(findPendingMovieTicket, 1);
                }
            }
            // 追加
            authorizeSeatReservations.push(authorizeSeatReservation);
            const movieTicketReservations = reservations.filter(r => r.ticket !== undefined && r.ticket.movieTicket !== undefined);
            if (movieTicketReservations.length > 0
                && authorizeSeatReservation.result !== undefined
                && authorizeSeatReservation.result.responseBody.object.reservations !== undefined) {
                const pendingReservations = authorizeSeatReservation.result.responseBody.object.reservations;
                pendingMovieTickets.push({
                    id: authorizeSeatReservation.id,
                    movieTickets: movieTicketReservations.map((r) => {
                        const pendingReservation = pendingReservations.find((p) => {
                            return (p.reservedTicket.ticketedSeat !== undefined
                                && r.seat !== undefined
                                && p.reservedTicket.ticketedSeat.seatNumber === r.seat.seatNumber
                                && p.reservedTicket.ticketedSeat.seatSection === r.seat.seatSection);
                        });
                        if (pendingReservation === undefined
                            || pendingReservation.reservedTicket.ticketedSeat === undefined) {
                            throw new Error('pendingReservation is undefined');
                        }
                        const movieTicket =
                            (<factory.paymentMethod.paymentCard.movieTicket.IMovieTicket>(
                                <Models.Purchase.Reservation.IReservationTicket>r.ticket
                            ).movieTicket);
                        movieTicket.serviceOutput = {
                            reservationFor: {
                                typeOf: factory.chevre.eventType.ScreeningEvent,
                                id: pendingReservation.reservationFor.id
                            },
                            reservedTicket: { ticketedSeat: pendingReservation.reservedTicket.ticketedSeat }
                        };
                        return movieTicket;
                    })
                });
            }
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    authorizeSeatReservation,
                    removeAuthorizeSeatReservation,
                    reservations,
                    authorizeSeatReservations,
                    pendingMovieTickets
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.temporaryReservationFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.cancelTemporaryReservations, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.CancelTemporaryReservations' };
        }),
        on(purchaseAction.cancelTemporaryReservationsSuccess, (state, payload) => {
            const authorizeSeatReservations =
                Functions.Util.deepCopy<factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[]>
                    (state.purchaseData.authorizeSeatReservations);
            const pendingMovieTickets =
                Functions.Util.deepCopy<Models.Purchase.MovieTicket.IMovieTicket[]>(state.purchaseData.pendingMovieTickets);
            payload.authorizeSeatReservations.forEach((authorizeSeatReservation) => {
                const findAuthorizeSeatReservation =
                    Functions.Util.deepCopy<factory.action.authorize.offer.seatReservation.IAction<
                        factory.service.webAPI.Identifier.Chevre
                    >[]>
                        (authorizeSeatReservations).findIndex(
                            target => target.id === authorizeSeatReservation.id
                        );
                if (findAuthorizeSeatReservation > -1) {
                    authorizeSeatReservations.splice(findAuthorizeSeatReservation, 1);
                }
                const findPendingMovieTicket = pendingMovieTickets.findIndex(
                    target => target.id === authorizeSeatReservation.id
                );
                if (findPendingMovieTicket > -1) {
                    pendingMovieTickets.splice(findPendingMovieTicket, 1);
                }
            });
            return {
                ...state, purchaseData: {
                    ...state.purchaseData,
                    authorizeSeatReservations,
                    pendingMovieTickets
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.cancelTemporaryReservationsFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.registerCreditCard, (state, payload) => {
            const creditCard = payload.creditCard;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    creditCard
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.registerContact, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.RegisterContact' };
        }),
        on(purchaseAction.registerContactSuccess, (state, payload) => {
            const profile = payload.profile;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    profile
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.registerContactFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.authorizeCreditCard, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.AuthorizeCreditCard' };
        }),
        on(purchaseAction.authorizeCreditCardSuccess, (state, payload) => {
            const authorizeCreditCardPayment = payload.authorizeCreditCardPayment;
            const orderCount = state.purchaseData.orderCount + 1;
            const authorizeCreditCardPayments =
                Functions.Util.deepCopy<factory.action.authorize.paymentMethod.creditCard.IAction[]>
                    (state.purchaseData.authorizeCreditCardPayments);
            authorizeCreditCardPayments.push(authorizeCreditCardPayment);
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    authorizeCreditCardPayments,
                    orderCount,
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.authorizeCreditCardFail, (state, payload) => {
            const error = payload.error;
            const orderCount = state.purchaseData.orderCount + 1;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    orderCount,
                }, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error)
            };
        }),
        on(purchaseAction.createGmoTokenObject, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.CreateGmoTokenObject' };
        }),
        on(purchaseAction.createGmoTokenObjectSuccess, (state, payload) => {
            const gmoTokenObject = payload.gmoTokenObject;
            const creditCard = payload.gmoTokenObject;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    gmoTokenObject,
                    creditCard
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.createGmoTokenObjectFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.authorizeMovieTicket, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.AuthorizeMovieTicket' };
        }),
        on(purchaseAction.authorizeMovieTicketSuccess, (state, payload) => {
            const authorizeMovieTicketPayments = payload.authorizeMovieTicketPayments;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    authorizeMovieTicketPayments
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.authorizeMovieTicketFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.checkMovieTicket, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.CheckMovieTicket' };
        }),
        on(purchaseAction.checkMovieTicketSuccess, (state, payload) => {
            const checkMovieTicketAction = payload.checkMovieTicketAction;
            const checkMovieTicketActions =
                Functions.Util.deepCopy<factory.action.check.paymentMethod.movieTicket.IAction[]>
                    (state.purchaseData.checkMovieTicketActions);
            const sameMovieTicketFilterResults = Functions.Purchase.sameMovieTicketFilter({
                checkMovieTicketAction, checkMovieTicketActions
            });
            if (sameMovieTicketFilterResults.length === 0
                && Functions.Purchase.isAvailabilityMovieTicket(checkMovieTicketAction)) {
                checkMovieTicketActions.push(checkMovieTicketAction);
            }

            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    checkMovieTicketAction,
                    checkMovieTicketActions,
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.checkMovieTicketFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.endTransaction, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.EndTransaction' };
        }),
        on(purchaseAction.endTransactionSuccess, (state, payload) => {
            const order = payload.order;
            return {
                ...state,
                purchaseData: {
                    preScheduleDates: [],
                    reservations: [],
                    screeningEventTicketOffers: [],
                    orderCount: 0,
                    authorizeSeatReservations: [],
                    checkMovieTicketActions: [],
                    authorizeCreditCardPayments: [],
                    authorizeMovieTicketPayments: [],
                    isUsedMovieTicket: false,
                    pendingMovieTickets: [],
                    order
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.endTransactionFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(purchaseAction.convertExternalToPurchase, (state) => {
            return { ...state, loading: true, process: 'purchaseAction.ConvertExternalToPurchase' };
        }),
        on(purchaseAction.convertExternalToPurchaseSuccess, (state, payload) => {
            const screeningEvent = payload.screeningEvent;
            const seller = payload.seller;
            const theater = payload.theater;
            return {
                ...state,
                purchaseData: {
                    ...state.purchaseData,
                    screeningEvent,
                    seller,
                    theater
                }, loading: false, process: '', error: null
            };
        }),
        on(purchaseAction.convertExternalToPurchaseFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
    )(initialState, action);
}
