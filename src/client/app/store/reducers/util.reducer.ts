import { IState } from '.';
import { utilAction } from '../actions';


/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: utilAction.Actions): IState {
    switch (action.type) {
        case utilAction.ActionTypes.LoadStart: {
            const process = (action.payload === undefined) ? 'load' : action.payload.process;
            return { ...state, loading: true, process };
        }
        case utilAction.ActionTypes.LoadEnd: {
            return { ...state, loading: false, process: '' };
        }
        case utilAction.ActionTypes.SetError: {
            return { ...state, error: JSON.stringify(action.payload.error) };
        }
        default: {
            return state;
        }
    }
}
