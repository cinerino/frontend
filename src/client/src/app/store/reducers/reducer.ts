import { ISearchResult } from '@cinerino/api-abstract-client/lib/service';
import { IAuthorizeAction } from '@cinerino/api-abstract-client/lib/service/transaction/placeOrder';
import { factory } from '@cinerino/api-javascript-client';
import { IResult } from '@cinerino/factory/lib/factory/transaction/placeOrder';
import { IReservation, IScreen } from '../../models';
import * as purchase from '../actions/purchase.action';
import * as user from '../actions/user.action';
import {
    createscreeningEventDates,
    createScreeningFilmEvents,
    IScreeningEventDate,
    IScreeningEventFilm
} from '../functions';

/**
 * IPurchaseState
 */
export interface IPurchaseState {
    movieTheaters: ISearchResult<factory.organization.movieTheater.IOrganization[]>;
    movieTheater?: factory.organization.movieTheater.IOrganization;
    screeningEvents: ISearchResult<factory.chevre.event.screeningEvent.IEvent[]>;
    screeningEvent?: factory.chevre.event.screeningEvent.IEvent;
    scheduleDates: IScreeningEventDate[];
    scheduleDate?: IScreeningEventDate;
    screeningFilmEvents: IScreeningEventFilm[];
    transaction?: factory.transaction.placeOrder.ITransaction;
    screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
    screenData?: IScreen;
    reservations: IReservation[];
    screeningEventTicketTypes: factory.chevre.ticketType.ITicketType[];
    authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction;
    customerContact?: factory.transaction.placeOrder.ICustomerContact;
    authorizeCreditCardPayment?: IAuthorizeAction;
    gmoTokenObject?: any;
    orderCount: number;
    result?: IResult;
}

/**
 * State
 */
export interface IState {
    loading: boolean;
    error: string | null;
    purchase: IPurchaseState;
    user: any;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    error: null,
    purchase: {
        movieTheaters: { totalCount: 0, data: [] },
        screeningEvents: { totalCount: 0, data: [] },
        scheduleDates: [],
        screeningFilmEvents: [],
        screeningEventOffers: [],
        reservations: [],
        screeningEventTicketTypes: [],
        orderCount: 0
    },
    user: null
};

function getInitialState(): IState {
    const json = localStorage.getItem('state');
    if (json === undefined || json === null || json === '{}') {
        return initialState;
    }
    const data = JSON.parse(json);
    return {
        loading: data.App.loading,
        error: data.App.error,
        purchase: data.App.purchase,
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
    action: purchase.Actions | user.Actions
): IState {
    switch (action.type) {
        case purchase.ActionTypes.Delete: {
            return {
                loading: initialState.loading,
                purchase: {
                    movieTheaters: { totalCount: 0, data: [] },
                    screeningEvents: { totalCount: 0, data: [] },
                    scheduleDates: [],
                    screeningFilmEvents: [],
                    screeningEventOffers: [],
                    reservations: [],
                    screeningEventTicketTypes: [],
                    orderCount: 0
                },
                user: state.user,
                error: state.error
            };
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
            const movieTheater = action.payload.movieTheater;
            return { ...state, loading: false, error: null, purchase: { ...state.purchase, movieTheater } };
        }
        case purchase.ActionTypes.SelectScheduleDate: {
            const scheduleDate = action.payload.scheduleDate;
            const screeningEvents = state.purchase.screeningEvents;
            const screeningFilmEvents = createScreeningFilmEvents({ screeningEvents, scheduleDate });
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    scheduleDate,
                    screeningFilmEvents
                }
            };
        }
        case purchase.ActionTypes.GetSchedule: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetScheduleSuccess: {
            const screeningEvents = action.payload.screeningEvents;
            const scheduleDates = createscreeningEventDates(screeningEvents);
            const scheduleDate = scheduleDates[0];
            const screeningFilmEvents = createScreeningFilmEvents({ screeningEvents, scheduleDate });
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    screeningEvents,
                    scheduleDates,
                    scheduleDate,
                    screeningFilmEvents
                }
            };
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
            const transaction = action.payload.transaction;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    transaction
                }
            };
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
        case purchase.ActionTypes.SelectSeat: {
            state.purchase.reservations.push({ seat: action.payload.seat });
            const reservations = state.purchase.reservations;
            return { ...state, loading: false, error: null, purchase: { ...state.purchase, reservations } };
        }
        case purchase.ActionTypes.CancelSeat: {
            const reservations = state.purchase.reservations.filter((reservation) => {
                return (reservation.seat.seatNumber !== action.payload.seat.seatNumber
                    || reservation.seat.seatSection !== action.payload.seat.seatSection);
            });
            return { ...state, loading: false, error: null, purchase: { ...state.purchase, reservations } };
        }
        case purchase.ActionTypes.GetTicketList: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.GetTicketListSuccess: {
            const screeningEventTicketTypes = action.payload.screeningEventTicketTypes;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    screeningEventTicketTypes
                }
            };
        }
        case purchase.ActionTypes.GetTicketListFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case purchase.ActionTypes.SelectTicket: {
            const reservations: IReservation[] = [];
            state.purchase.reservations.forEach((reservation) => {
                if (Object.is(reservation, action.payload.reservation)) {
                    reservations.push(action.payload.reservation);
                } else {
                    reservations.push(reservation);
                }
            });
            return {
                ...state, purchase: {
                    ...state.purchase,
                    reservations
                }
            };
        }
        case purchase.ActionTypes.TemporaryReservation: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.TemporaryReservationSuccess: {
            const authorizeSeatReservation = action.payload.authorizeSeatReservation;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    authorizeSeatReservation
                }
            };
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
        case purchase.ActionTypes.RegisterCreditCard: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.RegisterCreditCardSuccess: {
            const authorizeCreditCardPayment = action.payload.authorizeCreditCardPayment;
            const gmoTokenObject = action.payload.gmoTokenObject;
            const orderCount = state.purchase.orderCount + 1;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    authorizeCreditCardPayment,
                    gmoTokenObject,
                    orderCount
                }
            };
        }
        case purchase.ActionTypes.RegisterCreditCardFail: {
            const error = action.payload.error;
            const orderCount = state.purchase.orderCount + 1;
            return {
                ...state, loading: false,
                error: JSON.stringify(error),
                purchase: {
                    ...state.purchase,
                    orderCount: orderCount
                }
            };
        }
        case purchase.ActionTypes.Reservation: {
            return { ...state, loading: true };
        }
        case purchase.ActionTypes.ReservationSuccess: {
            const result = action.payload.result;
            return {
                ...state, loading: false, error: null, purchase: {
                    ...state.purchase,
                    result
                }
            };
        }
        case purchase.ActionTypes.ReservationFail: {
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
