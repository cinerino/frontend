import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { getEnvironment } from '../../../environments/environment';
import { orderAction } from '../actions';

export interface IOrderState {
    order?: factory.order.IOrder;
    orders: factory.order.IOrder[];
    totalCount: number;
    pageCount: number;
}

export const orderInitialState: IOrderState = {
    orders: [],
    totalCount: 0,
    pageCount: 1
};

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: orderAction.Actions): IState {
    const environment = getEnvironment();
    switch (action.type) {
        case orderAction.ActionTypes.Delete: {
            state.orderData = {
                orders: [],
                totalCount: 0,
                pageCount: 1
            };
            return { ...state };
        }
        case orderAction.ActionTypes.Cancel: {
            return { ...state, loading: true, process: 'orderAction.Cancel' };
        }
        case orderAction.ActionTypes.CancelSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case orderAction.ActionTypes.CancelFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case orderAction.ActionTypes.Inquiry: {
            return { ...state, loading: true, process: 'orderAction.Inquiry' };
        }
        case orderAction.ActionTypes.InquirySuccess: {
            const order = action.payload.order;
            state.orderData.order = order;
            return { ...state, loading: false, process: '', error: null };
        }
        case orderAction.ActionTypes.InquiryFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case orderAction.ActionTypes.OrderAuthorize: {
            return { ...state, loading: true, process: 'orderAction.OrderAuthorize', };
        }
        case orderAction.ActionTypes.OrderAuthorizeSuccess: {
            const authorizeOrder = action.payload.order;
            state.orderData.order = authorizeOrder;

            return { ...state, loading: false, process: '', error: null };
        }
        case orderAction.ActionTypes.OrderAuthorizeFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case orderAction.ActionTypes.Print: {
            return { ...state, loading: environment.PRINT_LOADING, process: 'orderAction.Print' };
        }
        case orderAction.ActionTypes.PrintSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case orderAction.ActionTypes.PrintFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
