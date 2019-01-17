import { Reservation } from '../../models';
import * as inquiryAction from '../actions/inquiry.action';
import * as purchaseAction from '../actions/purchase.action';
import * as userAction from '../actions/user.action';
import * as inquiryReducer from './inquiry.reducer';
import * as purchaseReducer from './purchase.reducer';
import * as userReducer from './user.reducer';

export { IPurchaseState } from './purchase.reducer';
export { IInquiryState } from './inquiry.reducer';
export { IUserState } from './user.reducer';

/**
 * State
 */
export interface IState {
    loading: boolean;
    process: string;
    error: string | null;
    purchase: purchaseReducer.IPurchaseState;
    inquiry: inquiryReducer.IInquiryState;
    user: userReducer.IUserState;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    process: '',
    error: null,
    purchase: {
        movieTheaters: [],
        screeningEvents: [],
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
    },
    inquiry: {
        orders: []
    },
    user: {
        isMember: false
    }
};

function getInitialState(): IState {
    const json = sessionStorage.getItem('state');
    if (json === undefined || json === null) {
        return initialState;
    }
    const data = JSON.parse(json);
    const reservations = data.App.purchase.reservations.map((reservation: Reservation) => new Reservation(reservation));
    data.App.purchase.reservations = reservations;

    return {
        loading: data.App.loading,
        process: data.App.process,
        error: data.App.error,
        purchase: data.App.purchase,
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
    action: purchaseAction.Actions | userAction.Actions | inquiryAction.Actions
): IState {
    if (/\[Purchase\]/.test(action.type)) {
        return purchaseReducer.reducer(state, <purchaseAction.Actions>action);
    } else if (/\[User\]/.test(action.type)) {
        return userReducer.reducer(state, <userAction.Actions>action);
    } else if (/\[Inquiry\]/.test(action.type)) {
        return inquiryReducer.reducer(state, <inquiryAction.Actions>action);
    } else {
        return state;
    }
}

/**
 * Selectors
 */
export const getLoading = (state: IState) => state.loading;
export const getProcess = (state: IState) => state.process;
export const getError = (state: IState) => state.error;
export const getPurchase = (state: IState) => state.purchase;
export const getInquiry = (state: IState) => state.inquiry;
export const getUser = (state: IState) => state.user;
