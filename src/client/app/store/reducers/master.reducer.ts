import { factory } from '@cinerino/api-javascript-client';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { masterAction } from '../actions';

/**
 * IMasterState
 */
export interface IMasterState {
    projects: factory.project.IProject[];
}

export const masterInitialState: IMasterState = {
    projects: []
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(masterAction.remove, state => {
            return { ...state, masterData: { projects: [] } };
        }),
        on(masterAction.getProjects, (state) => {
            return { ...state, loading: true, process: 'masterAction.GetProjects' };
        }),
        on(masterAction.getProjectsSuccess, (state, payload) => {
            const projects = payload.projects;

            return { ...state, masterData: { projects }, loading: false, process: '', error: null };
        }),
        on(masterAction.getProjectsFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: (error.message) ? error.message :  JSON.stringify(error) };
        }),
    )(initialState, action);
}
