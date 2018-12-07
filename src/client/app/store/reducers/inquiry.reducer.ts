import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { Actions, ActionTypes } from '../actions/inquiry.action';

export interface IInquiryState {
    order?: factory.order.IOrder;
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.inquiry = {};
            return { ...state };
        }
        case ActionTypes.Inquiry: {
            return { ...state, loading: true };
        }
        case ActionTypes.InquirySuccess: {
            const order = action.payload.order;
            return {
                ...state, loading: false, error: null, inquiry: {
                    order
                }
            };
        }
        case ActionTypes.InquiryFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
