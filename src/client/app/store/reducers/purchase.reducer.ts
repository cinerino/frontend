import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import {
    isAvailabilityMovieTicket,
    sameMovieTicketFilter
} from '../../functions';
import { IMovieTicket, IReservationTicket, IScreen, Reservation } from '../../models';
import { purchaseAction } from '../actions';

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
    external?: { sellerId?: string; eventId?: string; };
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
export function reducer(state: IState, action: purchaseAction.Actions): IState {
    switch (action.type) {
        case purchaseAction.ActionTypes.Delete: {
            state.purchaseData.reservations = [];
            state.purchaseData.screeningEvent = undefined;
            state.purchaseData.screeningEventTicketOffers = [];
            state.purchaseData.authorizeSeatReservation = undefined;
            state.purchaseData.checkMovieTicketAction = undefined;
            state.purchaseData.isUsedMovieTicket = false;
            state.purchaseData.pendingMovieTickets = [];
            state.purchaseData.orderCount = 0;
            state.purchaseData.authorizeCreditCardPayments = [];
            state.purchaseData.authorizeMovieTicketPayments = [];
            state.purchaseData.checkMovieTicketActions = [];
            state.purchaseData.authorizeSeatReservations = [];
            state.purchaseData.screeningEventOffers = [];
            state.purchaseData.preScheduleDates = [];
            return { ...state };
        }
        case purchaseAction.ActionTypes.UnsettledDelete: {
            state.purchaseData.reservations = [];
            state.purchaseData.screeningEvent = undefined;
            state.purchaseData.screeningEventTicketOffers = [];
            state.purchaseData.authorizeSeatReservation = undefined;
            state.purchaseData.checkMovieTicketAction = undefined;
            state.purchaseData.isUsedMovieTicket = false;
            return { ...state };
        }
        case purchaseAction.ActionTypes.SelectSeller: {
            state.purchaseData.seller = action.payload.seller;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.SelectScheduleDate: {
            const scheduleDate = action.payload.scheduleDate;
            state.purchaseData.scheduleDate = scheduleDate;
            return { ...state, loading: true, process: '', error: null };
        }
        case purchaseAction.ActionTypes.GetPreScheduleDates: {
            return { ...state, loading: true, process: 'purchaseAction.GetPreScheduleDates' };
        }
        case purchaseAction.ActionTypes.GetPreScheduleDatesSuccess: {
            const preScheduleDates = action.payload.sheduleDates;
            state.purchaseData.preScheduleDates = preScheduleDates;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.GetPreScheduleDatesFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.SelectSchedule: {
            const screeningEvent = action.payload.screeningEvent;
            state.purchaseData.screeningEvent = screeningEvent;
            return { ...state, loading: false, process: '' };
        }
        case purchaseAction.ActionTypes.StartTransaction: {
            return { ...state, loading: true, process: 'purchaseAction.StartTransaction' };
        }
        case purchaseAction.ActionTypes.StartTransactionSuccess: {
            state.purchaseData.transaction = action.payload.transaction;
            state.purchaseData.preScheduleDates = [];
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.StartTransactionFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.GetScreen: {
            state.purchaseData.screeningEventOffers = [];
            state.purchaseData.screenData = undefined;
            return { ...state, loading: true, process: 'purchaseAction.GetScreen' };
        }
        case purchaseAction.ActionTypes.GetScreenSuccess: {
            const screeningEventOffers = action.payload.screeningEventOffers;
            const screenData = action.payload.screenData;
            state.purchaseData.screeningEventOffers = screeningEventOffers;
            state.purchaseData.screenData = screenData;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.GetScreenFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.SelectSeats: {
            const reservations = state.purchaseData.reservations;
            action.payload.seats.forEach((seat) => {
                reservations.push(new Reservation({ seat }));
            });
            state.purchaseData.reservations = reservations;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.CancelSeats: {
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
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.GetTicketList: {
            return { ...state, loading: true, process: 'purchaseAction.GetTicketList' };
        }
        case purchaseAction.ActionTypes.GetTicketListSuccess: {
            const screeningEventTicketOffers = action.payload.screeningEventTicketOffers;
            const movieTicketTypeOffers = screeningEventTicketOffers.filter((offer) => {
                const movieTicketTypeChargeSpecifications = offer.priceSpecification.priceComponent.filter((priceComponent) => {
                    return (priceComponent.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification);
                });
                return (movieTicketTypeChargeSpecifications.length > 0);
            });
            state.purchaseData.screeningEventTicketOffers = screeningEventTicketOffers;
            state.purchaseData.isUsedMovieTicket = (movieTicketTypeOffers.length > 0);
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.GetTicketListFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.SelectTickets: {
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
        case purchaseAction.ActionTypes.TemporaryReservation: {
            return { ...state, loading: true, process: 'purchaseAction.TemporaryReservation' };
        }
        case purchaseAction.ActionTypes.TemporaryReservationSuccess: {
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
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.TemporaryReservationFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.TemporaryReservationFreeSeat: {
            return { ...state, loading: true, process: 'purchaseAction.TemporaryReservationFreeSeat' };
        }
        case purchaseAction.ActionTypes.TemporaryReservationFreeSeatSuccess: {
            const addAuthorizeSeatReservation = action.payload.addAuthorizeSeatReservation;
            state.purchaseData.authorizeSeatReservation = addAuthorizeSeatReservation;
            state.purchaseData.screeningEventOffers = [];
            state.purchaseData.authorizeSeatReservation = undefined;
            state.purchaseData.authorizeSeatReservations.push(addAuthorizeSeatReservation);
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.TemporaryReservationFreeSeatFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.CancelTemporaryReservations: {
            return { ...state, loading: true, process: 'purchaseAction.CancelTemporaryReservations'};
        }
        case purchaseAction.ActionTypes.CancelTemporaryReservationsSuccess: {
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

            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.CancelTemporaryReservationsFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.RegisterCreditCard: {
            const creditCard = action.payload.creditCard;
            state.purchaseData.creditCard = creditCard;
            return { ...state, loading: false, process: '', };
        }
        case purchaseAction.ActionTypes.RemoveCreditCard: {
            state.purchaseData.creditCard = undefined;
            return { ...state, loading: false, process: '', };
        }
        case purchaseAction.ActionTypes.RegisterContact: {
            return { ...state, loading: true, process: 'purchaseAction.RegisterContact' };
        }
        case purchaseAction.ActionTypes.RegisterContactSuccess: {
            const customerContact = action.payload.customerContact;
            state.purchaseData.customerContact = customerContact;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.RegisterContactFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.AuthorizeCreditCard: {
            return { ...state, loading: true, process: 'purchaseAction.AuthorizeCreditCard' };
        }
        case purchaseAction.ActionTypes.AuthorizeCreditCardSuccess: {
            const authorizeCreditCardPayment = action.payload.authorizeCreditCardPayment;
            const orderCount = state.purchaseData.orderCount + 1;
            state.purchaseData.authorizeCreditCardPayments.push(authorizeCreditCardPayment);
            state.purchaseData.orderCount = orderCount;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.AuthorizeCreditCardFail: {
            const error = action.payload.error;
            const orderCount = state.purchaseData.orderCount + 1;
            state.purchaseData.orderCount = orderCount;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.CreateGmoTokenObject: {
            return { ...state, loading: true, process: 'purchaseAction.CreateGmoTokenObject' };
        }
        case purchaseAction.ActionTypes.CreateGmoTokenObjectSuccess: {
            const gmoTokenObject = action.payload.gmoTokenObject;
            state.purchaseData.creditCard = gmoTokenObject;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.CreateGmoTokenObjectFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.AuthorizeMovieTicket: {
            return { ...state, loading: true, process: 'purchaseAction.AuthorizeMovieTicket' };
        }
        case purchaseAction.ActionTypes.AuthorizeMovieTicketSuccess: {
            const authorizeMovieTicketPayments = action.payload.authorizeMovieTicketPayments;
            state.purchaseData.authorizeMovieTicketPayments = authorizeMovieTicketPayments;
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.AuthorizeMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.CheckMovieTicket: {
            return { ...state, loading: true, process: 'purchaseAction.CheckMovieTicket' };
        }
        case purchaseAction.ActionTypes.CheckMovieTicketSuccess: {
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

            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.CheckMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.Reserve: {
            return { ...state, loading: true, process: 'purchaseAction.Reserve' };
        }
        case purchaseAction.ActionTypes.ReserveSuccess: {
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
            return { ...state, loading: false, process: '', error: null };
        }
        case purchaseAction.ActionTypes.ReserveFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case purchaseAction.ActionTypes.SetExternal: {
            const sellerId = action.payload.sellerId;
            const eventId = action.payload.eventId;
            state.purchaseData.external =
                (sellerId === undefined && eventId === undefined) ? undefined : { sellerId, eventId };
            return { ...state };
        }
        default: {
            return state;
        }
    }
}
