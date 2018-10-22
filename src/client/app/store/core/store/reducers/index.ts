// tslint:disable:no-empty-interface
import {
    ActionReducer,
    ActionReducerMap,
    MetaReducer
} from '@ngrx/store';

/**
 * Root state
 */
export interface IState {
}

/**
 * Reducers
 */
export const reducers: ActionReducerMap<IState> = {
};

export function main(reducer: ActionReducer<IState>) {
    return (state: any, action: any) => {
        const newState = reducer(state, action);
        logger(state, newState, action);
        storageSync(newState);
        return newState;
    };
}

/**
 * Logger
 */
export function logger(state: any, newState: any, action: any) {
    console.log('logger action', action);
    console.log('logger state', state);
    console.log('logger newState', newState);
}

/**
 * storageSync
 */
export function storageSync(state: any) {
    if (state === undefined
        || state === null
        || Object.keys(state).length === 0) {
        return;
    }
    localStorage.setItem('state', JSON.stringify(state));
}

/**
 * Meta reducer
 */
export const metaReducers: MetaReducer<IState>[] = [main];
