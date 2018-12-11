import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { Actions, ActionTypes } from '../actions/user.action';

export interface IUserState {
    isMember: boolean;
    userName?: string;
    profile?: factory.person.IProfile;
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.user.isMember = false;
            return { ...state, loading: false };
        }
        case ActionTypes.Initialize: {
            state.user.isMember = true;
            return { ...state, loading: false };
        }
        case ActionTypes.Create: {
            return { ...state, loading: true };
        }
        case ActionTypes.CreateSuccess: {
            const profile = action.payload.profile;
            state.user.profile = profile;
            return { ...state, loading: false, error: null };
        }
        case ActionTypes.CreateFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdateCustomer: {
            return { ...state, loading: true };
        }
        case ActionTypes.UpdateCustomerSuccess: {
            state.user.profile = action.payload.profile;
            return { ...state, loading: false, error: null };
        }
        case ActionTypes.UpdateCustomerFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdatePayment: {
            return { ...state, loading: true };
        }
        case ActionTypes.UpdatePaymentSuccess: {
            return { ...state, loading: false, error: null };
        }
        case ActionTypes.UpdatePaymentFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
