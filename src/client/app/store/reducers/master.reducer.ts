import { factory } from '@cinerino/api-javascript-client';
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

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: masterAction.Actions): IState {
    switch (action.type) {
        case masterAction.ActionTypes.Delete: {
            state.masterData = {
                projects: []
            };
            return { ...state };
        }
        case masterAction.ActionTypes.GetProjects: {
            return { ...state, loading: true, process: 'masterAction.GetProjects' };
        }
        case masterAction.ActionTypes.GetProjectsSuccess: {
            const projects = action.payload.projects;
            state.masterData.projects = projects;

            return { ...state, loading: false, process: '', error: null };
        }
        case masterAction.ActionTypes.GetProjectsFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
