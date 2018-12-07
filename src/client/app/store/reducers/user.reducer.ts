import { IState } from '.';
import { Actions, ActionTypes } from '../actions/user.action';

export interface IUserState {
    userName?: string;
    isMember: boolean;
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.user = { isMember: false };
            return { ...state, loading: true };
        }
        case ActionTypes.Create: {
            return { ...state, loading: true };
        }
        case ActionTypes.CreateSuccess: {
            state.user = { isMember: true };
            return { ...state, loading: false, error: null };
        }
        case ActionTypes.CreateFail: {
            const error = action.payload.error;
            return { ...state, loading: false, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
