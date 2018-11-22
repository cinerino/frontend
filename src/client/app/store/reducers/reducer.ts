import { factory } from '@cinerino/api-javascript-client';
import {
    createScreeningFilmEvents,
    IGmoTokenObject,
    isAvailabilityMovieTicket,
    IScreeningEventFilm,
    sameMovieTicketFilter
} from '../../functions';
import { IScreen, Reservation } from '../../models';
import * as inquiry from '../actions/inquiry.action';
import * as purchase from '../actions/purchase.action';
import * as user from '../actions/user.action';

/**
 * IPurchaseState
 */
export interface IPurchaseState {
    movieTheaters: factory.organization.movieTheater.IOrganization[];
    movieTheater?: factory.organization.movieTheater.IOrganization;
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    scheduleDate?: string;
    screeningFilmEvents: IScreeningEventFilm[];
    transaction?: factory.transaction.placeOrder.ITransaction;
    screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
    screenData?: IScreen;
    reservations: Reservation[];
    screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction;
    customerContact?: factory.transaction.placeOrder.ICustomerContact;
    authorizeCreditCardPayment?: factory.action.authorize.paymentMethod.creditCard.IAction;
    authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[];
    gmoTokenObject?: IGmoTokenObject;
    orderCount: number;
    order?: factory.order.IOrder;
    checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    checkMovieTicketAction?: factory.action.check.paymentMethod.movieTicket.IAction;
    isUsedMovieTicket: boolean;
}

export interface IHistoryState {
    purchase: factory.order.IOrder[];
}

export interface IInquiryState {
    order?: factory.order.IOrder;
}

/**
 * State
 */
export interface IState {
    loading: boolean;
    error: string | null;
    purchase: IPurchaseState;
    history: IHistoryState;
    inquiry: IInquiryState;
    user: any;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    error: null,
    purchase: {
        movieTheaters: [],
        screeningEvents: [],
        screeningFilmEvents: [],
        screeningEventOffers: [],
        reservations: [],
        screeningEventTicketOffers: [],
        orderCount: 0,
        checkMovieTicketActions: [],
        authorizeMovieTicketPayments: [],
        isUsedMovieTicket: false
    },
    history: {
        purchase: []
    },
    inquiry: {},
    user: null
};

function getInitialState(): IState {
    const json = localStorage.getItem('state');
    if (json === undefined || json === null) {
        return initialState;
    }
    const data = JSON.parse(json);
    const reservations = data.App.purchase.reservations.map((reservation: Reservation) => new Reservation(reservation));
    data.App.purchase.reservations = reservations;

    return {
        loading: data.App.loading,
        error: data.App.error,
        purchase: data.App.purchase,
        history: data.App.history,
        inquiry: data.App.inquiry,
        user: data.App.user
    };
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(
    state = getInitialState(),
    action: purchase.Actions | user.Actions | inquiry.Actions
): IState {
    switch (action.type) {
        case purchase.ActionTypes.Delete: {
            state.purchase = {
                movieTheaters: [],
                screeningEvents: [],
                screeningFilmEvents: [],
                screeningEventOffers: [],
                reservations: [],
                screeningEventTicketOffers: [],
                orderCount: 0,
                checkMovieTicketActions: [],
                authorizeMovieTicketPayments: [],
                isUsedMovieTicket: false
            };
            return { ...state };
        }
        case purchase.ActionTypes.GetTheaters: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetTheatersSuccess: {
            const movieTheaters = action.payload.movieTheaters;
            return { ...state, loading: false, error: null, purchase: { ...state.purchase, movieTheaters } };
        }
        case purchase.ActionTypes.GetTheatersFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.SelectTheater: {
            state.purchase.movieTheater = action.payload.movieTheater;
            return { ...state, loading: false, error: null};
        }
        case purchase.ActionTypes.GetSchedule: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetScheduleSuccess: {
            const screeningEvents = action.payload.screeningEvents;
            const scheduleDate = action.payload.scheduleDate;
            const screeningFilmEvents = createScreeningFilmEvents({ screeningEvents });
            state.purchase.screeningEvents = screeningEvents;
            state.purchase.scheduleDate = scheduleDate;
            state.purchase.screeningFilmEvents = screeningFilmEvents;

            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.GetScheduleFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.SelectSchedule: {
            const screeningEvent = action.payload.screeningEvent;
            return {
                ...state, loading: false, purchase: {
                    ...state.purchase,
                    screeningEvent
                }
            };
        }
        case purchase.ActionTypes.StartTransaction: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.StartTransactionSuccess: {
            state.purchase.transaction = action.payload.transaction;
            state.purchase.screeningEvents = [];
            state.purchase.movieTheaters = [];
            state.purchase.screeningFilmEvents = [];
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.StartTransactionFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.GetScreen: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetScreenSuccess: {
            const screeningEventOffers = action.payload.screeningEventOffers;
            const screenData = action.payload.screenData;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    screeningEventOffers,
                    screenData
                }
            };
        }
        case purchase.ActionTypes.GetScreenFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.SelectSeats: {
            const reservations = state.purchase.reservations;
            action.payload.seats.forEach((seat) => {
                reservations.push(new Reservation({ seat }));
            });
            state.purchase.reservations = reservations;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.CancelSeats: {
            const reservations: Reservation[] = [];
            const seats = action.payload.seats;
            state.purchase.reservations.forEach((reservation) => {
                const findResult = seats.find((seat) => {
                    return (reservation.seat.seatNumber === seat.seatNumber
                        && reservation.seat.seatSection === seat.seatSection);
                });
                if (findResult === undefined) {
                    reservations.push(reservation);
                }
            });
            state.purchase.reservations = reservations;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.GetTicketList: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetTicketListSuccess: {
            const screeningEventTicketOffers = action.payload.screeningEventTicketOffers;
            const movieTicketTypeOffers = screeningEventTicketOffers.filter((offer) => {
                const movieTicketTypeChargeSpecifications = offer.priceSpecification.priceComponent.filter((priceComponent) => {
                    return (priceComponent.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification);
                });
                return (movieTicketTypeChargeSpecifications.length > 0);
            });
            state.purchase.screeningEventTicketOffers = screeningEventTicketOffers;
            state.purchase.isUsedMovieTicket = (movieTicketTypeOffers.length > 0);
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.GetTicketListFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.SelectTickets: {
            const reservations: Reservation[] = [];
            const selectedReservations = action.payload.reservations;
            state.purchase.reservations.forEach((reservation) => {
                const findResult =
                    selectedReservations.find(selectedReservation => Object.is(reservation, selectedReservation));
                if (findResult === undefined) {
                    reservations.push(reservation);
                } else {
                    reservations.push(findResult);
                }
            });
            state.purchase.reservations = reservations;
            return { ...state };
        }
        case purchase.ActionTypes.TemporaryReservation: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.TemporaryReservationSuccess: {
            const authorizeSeatReservation = action.payload.authorizeSeatReservation;
            state.purchase.authorizeSeatReservation = authorizeSeatReservation;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.TemporaryReservationFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.RegisterContact: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.RegisterContactSuccess: {
            const customerContact = action.payload.customerContact;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    customerContact
                }
            };
        }
        case purchase.ActionTypes.RegisterContactFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.AuthorizeCreditCard: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.AuthorizeCreditCardSuccess: {
            const authorizeCreditCardPayment = action.payload.authorizeCreditCardPayment;
            const orderCount = state.purchase.orderCount + 1;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    authorizeCreditCardPayment,
                    orderCount
                }
            };
        }
        case purchase.ActionTypes.AuthorizeCreditCardFail: {
            const error = action.payload.error;
            const orderCount = state.purchase.orderCount + 1;
            state.purchase.orderCount = orderCount;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.CreateGmoTokenObject: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.CreateGmoTokenObjectSuccess: {
            const gmoTokenObject = action.payload.gmoTokenObject;
            state.purchase.gmoTokenObject = gmoTokenObject;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.CreateGmoTokenObjectFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.AuthorizeMovieTicket: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.AuthorizeMovieTicketSuccess: {
            const authorizeMovieTicketPayments = action.payload.authorizeMovieTicketPayments;
            state.purchase.authorizeMovieTicketPayments = authorizeMovieTicketPayments;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.AuthorizeMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.CheckMovieTicket: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.CheckMovieTicketSuccess: {
            const checkMovieTicketAction = action.payload.checkMovieTicketAction;
            const checkMovieTicketActions = state.purchase.checkMovieTicketActions;
            const sameMovieTicketFilterResults = sameMovieTicketFilter({
                checkMovieTicketAction, checkMovieTicketActions
            });
            console.log(sameMovieTicketFilterResults.length, isAvailabilityMovieTicket(checkMovieTicketAction));
            if (sameMovieTicketFilterResults.length === 0
                && isAvailabilityMovieTicket(checkMovieTicketAction)) {
                state.purchase.checkMovieTicketActions.push(checkMovieTicketAction);
            }

            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    checkMovieTicketAction: checkMovieTicketAction
                }
            };
        }
        case purchase.ActionTypes.CheckMovieTicketFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.Reserve: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.ReserveSuccess: {
            const order = action.payload.order;
            state.purchase.order = order;
            return { ...state, loading: false, error: null };
        }
        case purchase.ActionTypes.ReserveFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.GetPurchaseHistory: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetPurchaseHistorySuccess: {
            const result = action.payload.result;
            return {
                ...state, loading: false, error: null, history: {
                    ...state.history,
                    purchase: result
                }
            };
        }
        case purchase.ActionTypes.GetPurchaseHistoryFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.OrderAuthorize: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.OrderAuthorizeSuccess: {
            const authorizeOrder = action.payload.order;
            const historyData = state.history.purchase.map((order) => {
                if (order.orderNumber !== authorizeOrder.orderNumber) {
                    return order;
                }
                return authorizeOrder;
            });
            const history = state.history;
            history.purchase = historyData;

            return { ...state, loading: false, error: null, history };
        }
        case purchase.ActionTypes.OrderAuthorizeFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case inquiry.ActionTypes.Delete: {
            state.inquiry = {};
            return { ...state };
        }
        case inquiry.ActionTypes.Inquiry: {
            return { ...state, loading: true };
        }
        case inquiry.ActionTypes.InquirySuccess: {
            const order = action.payload.order;
            return {
                ...state, loading: false, error: null, inquiry: {
                    order
                }
            };
        }
        case inquiry.ActionTypes.InquiryFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case user.ActionTypes.Load: {
            return { ...state, loading: true };
        }
        case user.ActionTypes.LoadSuccess: {
            return { ...state, loading: false, error: null };
        }
        case user.ActionTypes.LoadFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case user.ActionTypes.Create: {
            return { ...state, loading: true };
        }
        case user.ActionTypes.CreateSuccess: {
            return { ...state, loading: false, error: null };
        }
        case user.ActionTypes.CreateFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}

/**
 * Selectors
 */
export const getLoading = (state: IState) => state.loading;
export const getError = (state: IState) => state.error;
export const getPurchase = (state: IState) => state.purchase;
export const getHistory = (state: IState) => state.history;
export const getInquiry = (state: IState) => state.inquiry;
