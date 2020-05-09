import { Action } from '@ngrx/store';
import { getEnvironment } from '../../../environments/environment';
import * as masterReducer from './master.reducer';
import * as orderReducer from './order.reducer';
import * as purchaseReducer from './purchase.reducer';
import * as userReducer from './user.reducer';
import * as utilReducer from './util.reducer';

/**
 * State
 */
export interface IState {
    loading: boolean;
    process: string;
    error: string | null;
    purchaseData: purchaseReducer.IPurchaseState;
    userData: userReducer.IUserState;
    masterData: masterReducer.IMasterState;
    orderData: orderReducer.IOrderState;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    process: '',
    error: null,
    purchaseData: purchaseReducer.purchaseInitialState,
    userData: userReducer.userInitialState,
    masterData: masterReducer.masterInitialState,
    orderData: orderReducer.orderInitialState
};

function getInitialState(): IState {
    const environment = getEnvironment();
    const saveJson = (<Storage>(<any>window)[environment.STORAGE_TYPE]).getItem(environment.STORAGE_NAME);
    if (saveJson === undefined || saveJson === null) {
        return initialState;
    }
    const saveData: { App: IState } = JSON.parse(saveJson);
    const sessonJson = sessionStorage.getItem('SESSION_STATE');
    const sessionData = (sessonJson === undefined || sessonJson === null) ? { App: {} } : JSON.parse(sessonJson);
    const data: IState = { ...initialState, ...saveData.App, ...sessionData.App };
    (<any>data).userData.seller = undefined;
    data.loading = false;

    return data;
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(
    state = getInitialState(),
    action: Action
): IState {
    if (/\[Purchase\]/.test(action.type)) {
        return purchaseReducer.reducer(state, action);
    } else if (/\[User\]/.test(action.type)) {
        return userReducer.reducer(state, action);
    } else if (/\[Master\]/.test(action.type)) {
        return masterReducer.reducer(state, action);
    } else if (/\[Order\]/.test(action.type)) {
        return orderReducer.reducer(state, action);
    } else if (/\[Util\]/.test(action.type)) {
        return utilReducer.reducer(state, action);
    } else {
        return state;
    }
}

/**
 * Selectors
 */
export const getLoading = (state: IState) => state.loading;
export const getProcess = (state: IState) => `process.${state.process}`;
export const getError = (state: IState) => state.error;
export const getPurchase = (state: IState) => state.purchaseData;
export const getUser = (state: IState) => state.userData;
export const getMaster = (state: IState) => state.masterData;
export const getOrder = (state: IState) => state.orderData;
