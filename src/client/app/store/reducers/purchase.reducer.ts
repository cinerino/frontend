import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import {
    isAvailabilityMovieTicket,
    sameMovieTicketFilter
} from '../../functions';
import { IMovieTicket, IReservationTicket, IScreen, Reservation } from '../../models';
import { Actions, ActionTypes } from '../actions/purchase.action';

export interface IPurchaseState {
    seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    scheduleDate?: string;
    preScheduleDates: string[];
    transaction?: factory.transaction.placeOrder.ITransaction;
    screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
    screenData?: IScreen;
    reservations: Reservation[];
    screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[];
    customerContact?: factory.transaction.placeOrder.ICustomerContact;
    authorizeCreditCardPayments: factory.action.authorize.paymentMethod.creditCard.IAction[];
    authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[];
    creditCard?: factory.paymentMethod.paymentCard.creditCard.ICheckedCard
    | factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
    | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
    | factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
    orderCount: number;
    order?: factory.order.IOrder;
    checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    checkMovieTicketAction?: factory.action.check.paymentMethod.movieTicket.IAction;
    isUsedMovieTicket: boolean;
    pendingMovieTickets: IMovieTicket[];
}

export const purchaseInitialState: IPurchaseState = {
    preScheduleDates: [],
    screeningEventOffers: [],
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

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.purchaseData = {
                preScheduleDates: [],
                screeningEventOffers: [],
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
            return { ...state };
        }
        case ActionTypes.UnsettledDelete: {
            state.purchaseData.reservations = [];
            state.purchaseData.screeningEvent = undefined;
            state.purchaseData.screeningEventTicketOffers = [];
            state.purchaseData.authorizeSeatReservation = undefined;
            state.purchaseData.checkMovieTicketAction = undefined;
            state.purchaseData.isUsedMovieTicket = false;
            return { ...state };
        }
        case ActionTypes.SelectSeller: {
            state.purchaseData.seller = action.payload.seller;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.SelectScheduleDate: {
            const scheduleDate = action.payload.scheduleDate;
            state.purchaseData.scheduleDate = scheduleDate;
            return { ...state, loading: true, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetPreScheduleDates: {
            return { ...state, loading: true, process: { ja: '先行スケジュールを取得しています', en: 'Acquiring a preliminary schedule' }, };
        }
        case ActionTypes.GetPreScheduleDatesSuccess: {
            const preScheduleDates = action.payload.sheduleDates;
            state.purchaseData.preScheduleDates = preScheduleDates;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetPreScheduleDatesFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.SelectSchedule: {
            const screeningEvent = action.payload.screeningEvent;
            state.purchaseData.screeningEvent = screeningEvent;
            return { ...state, loading: false, process: { ja: '', en: '' } };
        }
        case ActionTypes.StartTransaction: {
            return { ...state, loading: true, process: { ja: '取引を開始しています', en: 'Trading is starting' }, };
        }
        case ActionTypes.StartTransactionSuccess: {
            state.purchaseData.transaction = action.payload.transaction;
            state.purchaseData.preScheduleDates = [];
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.StartTransactionFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.GetScreen: {
            return { ...state, loading: true, process: { ja: 'スクリーン情報を取得しています', en: 'Acquiring screen information' }, };
        }
        case ActionTypes.GetScreenSuccess: {
            const screeningEventOffers = action.payload.screeningEventOffers;
            const screenData = action.payload.screenData;
            state.purchaseData.screeningEventOffers = screeningEventOffers;
            state.purchaseData.screenData = screenData;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetScreenFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.SelectSeats: {
            const reservations = state.purchaseData.reservations;
            action.payload.seats.forEach((seat) => {
                reservations.push(new Reservation({ seat }));
            });
            state.purchaseData.reservations = reservations;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.CancelSeats: {
            const reservations: Reservation[] = [];
            const seats = action.payload.seats;
            state.purchaseData.reservations.forEach((reservation) => {
                const findResult = seats.find((seat) => {
                    return (reservation.seat.seatNumber === seat.seatNumber
                        && reservation.seat.seatSection === seat.seatSection);
                });
                if (findResult === undefined) {
                    reservations.push(reservation);
                }
            });
            state.purchaseData.reservations = reservations;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetTicketList: {
            return { ...state, loading: true, process: { ja: '券種情報を取得しています', en: 'Acquiring note type information' }, };
        }
        case ActionTypes.GetTicketListSuccess: {
            const screeningEventTicketOffers = action.payload.screeningEventTicketOffers;
            const movieTicketTypeOffers = screeningEventTicketOffers.filter((offer) => {
                const movieTicketTypeChargeSpecifications = offer.priceSpecification.priceComponent.filter((priceComponent) => {
                    return (priceComponent.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification);
                });
                return (movieTicketTypeChargeSpecifications.length > 0);
            });
            state.purchaseData.screeningEventTicketOffers = screeningEventTicketOffers;
            state.purchaseData.isUsedMovieTicket = (movieTicketTypeOffers.length > 0);
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetTicketListFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.SelectTickets: {
            const reservations: Reservation[] = [];
            const selectedReservations = action.payload.reservations;
            state.purchaseData.reservations.forEach((reservation) => {
                const findResult =
                    selectedReservations.find(selectedReservation => Object.is(reservation, selectedReservation));
                if (findResult === undefined) {
                    reservations.push(reservation);
                } else {
                    reservations.push(findResult);
                }
            });
            state.purchaseData.reservations = reservations;
            return { ...state };
        }
        case ActionTypes.TemporaryReservation: {
            return { ...state, loading: true, process: { ja: '座席を仮予約しています', en: 'Temporary reservation for seats' }, };
        }
        case ActionTypes.TemporaryReservationSuccess: {
            const addAuthorizeSeatReservation = action.payload.addAuthorizeSeatReservation;
            const removeAuthorizeSeatReservation = action.payload.removeAuthorizeSeatReservation;
            const reservations = state.purchaseData.reservations;
            state.purchaseData.authorizeSeatReservation = addAuthorizeSeatReservation;
            state.purchaseData.screeningEventOffers = [];
            const filterResult = reservations.filter(reservation => reservation.ticket === undefined);
            if (filterResult.length === 0) {
                if (removeAuthorizeSeatReservation !== undefined) {
                    // 削除
                    const findAuthorizeSeatReservation = state.purchaseData.authorizeSeatReservations.findIndex(
                        target => target.id === removeAuthorizeSeatReservation.id
                    );
                    if (findAuthorizeSeatReservation > -1) {
                        state.purchaseData.authorizeSeatReservations.splice(findAuthorizeSeatReservation, 1);
                    }
                    const findPendingMovieTicket = state.purchaseData.pendingMovieTickets.findIndex(
                        target => target.id === removeAuthorizeSeatReservation.id
                    );
                    if (findPendingMovieTicket > -1) {
                        state.purchaseData.pendingMovieTickets.splice(findPendingMovieTicket, 1);
                    }
                }
                // 追加
                state.purchaseData.authorizeSeatReservations.push(addAuthorizeSeatReservation);
                const movieTicketReservations = reservations.filter(r => r.ticket !== undefined && r.ticket.movieTicket !== undefined);
                if (movieTicketReservations.length > 0) {
                    const pendingReservations =
                        (<factory.chevre.reservation.IReservation<factory.chevre.event.screeningEvent.ITicketPriceSpecification>[]>
                            (<any>addAuthorizeSeatReservation.result).responseBody.object.reservations);
                    state.purchaseData.pendingMovieTickets.push({
                        id: addAuthorizeSeatReservation.id,
                        movieTickets: movieTicketReservations.map((r) => {
                            const pendingReservation = pendingReservations.find((p) => {
                                return (p.reservedTicket.ticketedSeat !== undefined
                                    && p.reservedTicket.ticketedSeat.seatNumber === r.seat.seatNumber
                                    && p.reservedTicket.ticketedSeat.seatSection === r.seat.seatSection);
                            });
                            if (pendingReservation === undefined
                                || pendingReservation.reservedTicket.ticketedSeat === undefined) {
                                throw new Error('pendingReservation is undefined');
                            }
                            const movieTicket =
                                (<factory.paymentMethod.paymentCard.movieTicket.IMovieTicket>(<IReservationTicket>r.ticket).movieTicket);
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
            }
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.TemporaryReservationFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.TemporaryReservationFreeSeat: {
            return { ...state, loading: true, process: { ja: '仮予約しています', en: 'Temporary reservation' }, };
        }
        case ActionTypes.TemporaryReservationFreeSeatSuccess: {
            const addAuthorizeSeatReservation = action.payload.addAuthorizeSeatReservation;
            state.purchaseData.authorizeSeatReservation = addAuthorizeSeatReservation;
            state.purchaseData.screeningEventOffers = [];
            state.purchaseData.authorizeSeatReservation = undefined;
            state.purchaseData.authorizeSeatReservations.push(addAuthorizeSeatReservation);
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.TemporaryReservationFreeSeatFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.CancelTemporaryReservations: {
            return {
                ...state, loading: true, process: {
                    ja: '座席の仮予約を削除しています',
                    en: 'Deleting the tentative reservation of the seat'
                }
            };
        }
        case ActionTypes.CancelTemporaryReservationsSuccess: {
            const authorizeSeatReservations = action.payload.authorizeSeatReservations;
            authorizeSeatReservations.forEach((authorizeSeatReservation) => {
                const findAuthorizeSeatReservation = state.purchaseData.authorizeSeatReservations.findIndex(
                    target => target.id === authorizeSeatReservation.id
                );
                if (findAuthorizeSeatReservation > -1) {
                    state.purchaseData.authorizeSeatReservations.splice(findAuthorizeSeatReservation, 1);
                }
                const findPendingMovieTicket = state.purchaseData.pendingMovieTickets.findIndex(
                    target => target.id === authorizeSeatReservation.id
                );
                if (findPendingMovieTicket > -1) {
                    state.purchaseData.pendingMovieTickets.splice(findPendingMovieTicket, 1);
                }
            });

            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.CancelTemporaryReservationsFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.RegisterCreditCard: {
            const creditCard = action.payload.creditCard;
            state.purchaseData.creditCard = creditCard;
            return { ...state, loading: false, process: { ja: '', en: '' }, };
        }
        case ActionTypes.RemoveCreditCard: {
            state.purchaseData.creditCard = undefined;
            return { ...state, loading: false, process: { ja: '', en: '' }, };
        }
        case ActionTypes.RegisterContact: {
            return { ...state, loading: true, process: { ja: '購入者情報を登録しています', en: 'Registering buyer information' }, };
        }
        case ActionTypes.RegisterContactSuccess: {
            const customerContact = action.payload.customerContact;
            state.purchaseData.customerContact = customerContact;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.RegisterContactFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.AuthorizeCreditCard: {
            return { ...state, loading: true, process: { ja: 'クレジットカード処理しています', en: 'Credit card processing' }, };
        }
        case ActionTypes.AuthorizeCreditCardSuccess: {
            const authorizeCreditCardPayment = action.payload.authorizeCreditCardPayment;
            const orderCount = state.purchaseData.orderCount + 1;
            state.purchaseData.authorizeCreditCardPayments.push(authorizeCreditCardPayment);
            state.purchaseData.orderCount = orderCount;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.AuthorizeCreditCardFail: {
            const error = action.payload.error;
            const orderCount = state.purchaseData.orderCount + 1;
            state.purchaseData.orderCount = orderCount;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.CreateGmoTokenObject: {
            return { ...state, loading: true, process: { ja: 'GMOトークン情報を取得しています', en: 'Acquiring GMO token information' } };
        }
        case ActionTypes.CreateGmoTokenObjectSuccess: {
            const gmoTokenObject = action.payload.gmoTokenObject;
            state.purchaseData.creditCard = gmoTokenObject;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.CreateGmoTokenObjectFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.AuthorizeMovieTicket: {
            return { ...state, loading: true, process: { ja: 'ムビチケ券を処理しています', en: 'Processing movie tickets' }, };
        }
        case ActionTypes.AuthorizeMovieTicketSuccess: {
            const authorizeMovieTicketPayments = action.payload.authorizeMovieTicketPayments;
            state.purchaseData.authorizeMovieTicketPayments = authorizeMovieTicketPayments;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.AuthorizeMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.CheckMovieTicket: {
            return { ...state, loading: true, process: { ja: 'ムビチケ券を認証しています', en: 'Certifying movie ticket' }, };
        }
        case ActionTypes.CheckMovieTicketSuccess: {
            const checkMovieTicketAction = action.payload.checkMovieTicketAction;
            const checkMovieTicketActions = state.purchaseData.checkMovieTicketActions;
            const sameMovieTicketFilterResults = sameMovieTicketFilter({
                checkMovieTicketAction, checkMovieTicketActions
            });
            // console.log(sameMovieTicketFilterResults.length, isAvailabilityMovieTicket(checkMovieTicketAction));
            if (sameMovieTicketFilterResults.length === 0
                && isAvailabilityMovieTicket(checkMovieTicketAction)) {
                state.purchaseData.checkMovieTicketActions.push(checkMovieTicketAction);
            }
            state.purchaseData.checkMovieTicketAction = checkMovieTicketAction;

            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.CheckMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.Reserve: {
            return { ...state, loading: true, process: { ja: '座席を予約しています', en: 'Reserving a seat' }, };
        }
        case ActionTypes.ReserveSuccess: {
            const order = action.payload.order;
            state.purchaseData = {
                preScheduleDates: [],
                screeningEventOffers: [],
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
            state.purchaseData.order = order;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.ReserveFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
