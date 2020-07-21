import { factory } from '@cinerino/sdk';
import { Action, createReducer, on } from '@ngrx/store';
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

export function reducer(initialState: IState, action: Action) {
    const environment = getEnvironment();
    return createReducer(
        initialState,
        on(orderAction.remove, state => {
            return { ...state, orderData: {
                orders: [],
                totalCount: 0,
                pageCount: 1
            } };
        }),
        on(orderAction.cancel, (state) => {
            return { ...state, loading: true, process: 'orderAction.Cancel' };
        }),
        on(orderAction.cancelSuccess, (state) => {
            return { ...state, loading: false, process: '', error: null };
        }),
        on(orderAction.cancelFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(orderAction.inquiry, (state) => {
            return { ...state, loading: true, process: 'orderAction.Inquiry' };
        }),
        on(orderAction.inquirySuccess, (state, payload) => {
            const order = payload.order;
            return { ...state, orderData: { ...state.orderData, order }, loading: false, process: '', error: null };
        }),
        on(orderAction.inquiryFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(orderAction.print, (state) => {
            return { ...state, loading: environment.PRINT_LOADING, process: 'orderAction.Print' };
        }),
        on(orderAction.printSuccess, (state) => {
            return { ...state, loading: false, process: '', error: null };
        }),
        on(orderAction.printFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
        on(orderAction.orderAuthorize, (state) => {
            return { ...state, loading: true, process: 'orderAction.OrderAuthorize' };
        }),
        on(orderAction.orderAuthorizeSuccess, (state, payload) => {
            const order = payload.order;
            return { ...state, orderData: { ...state.orderData, order }, loading: false, process: '', error: null };
        }),
        on(orderAction.orderAuthorizeFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        })
    )(initialState, action);
}
