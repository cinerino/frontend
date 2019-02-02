import { Reservation } from '../../models';
import * as masterAction from '../actions/master.action';
import * as orderAction from '../actions/order.action';
import * as purchaseAction from '../actions/purchase.action';
import * as userAction from '../actions/user.action';
import * as masterReducer from './master.reducer';
import * as orderReducer from './order.reducer';
import * as purchaseReducer from './purchase.reducer';
import * as userReducer from './user.reducer';
/**
 * State
 */
export interface IState {
    loading: boolean;
    process: string;
    error: string | null;
    purchase: purchaseReducer.IPurchaseState;
    user: userReducer.IUserState;
    master: masterReducer.IMasterState;
    order: orderReducer.IOrderState;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    process: '',
    error: null,
    purchase: purchaseReducer.purchaseInitialState,
    user: userReducer.userInitialState,
    master: masterReducer.masterInitialState,
    order: orderReducer.orderInitialState
};

function getInitialState(): IState {
    const json = sessionStorage.getItem('state');
    if (json === undefined || json === null) {
        return initialState;
    }
    const data: { App: IState } = JSON.parse(json);
    const reservations = data.App.purchase.reservations.map((reservation: Reservation) => new Reservation(reservation));
    data.App.purchase.reservations = reservations;

    return { ...initialState, ...data.App };
}

type Actions =
    purchaseAction.Actions
    | userAction.Actions
    | masterAction.Actions
    | orderAction.Actions;


/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(
    state = getInitialState(),
    action: Actions
): IState {
    if (/\[Purchase\]/.test(action.type)) {
        return purchaseReducer.reducer(state, <purchaseAction.Actions>action);
    } else if (/\[User\]/.test(action.type)) {
        return userReducer.reducer(state, <userAction.Actions>action);
    } else if (/\[Master\]/.test(action.type)) {
        return masterReducer.reducer(state, <masterAction.Actions>action);
    } else if (/\[Order\]/.test(action.type)) {
        return orderReducer.reducer(state, <orderAction.Actions>action);
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
export const getUser = (state: IState) => state.user;
export const getMaster = (state: IState) => state.master;
export const getOrder = (state: IState) => state.order;
