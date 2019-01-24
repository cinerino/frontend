import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { Actions, ActionTypes } from '../actions/master.action';

/**
 * IMasterState
 */
export interface IMasterState {
    movieTheaters: factory.organization.IOrganization<factory.organizationType.MovieTheater>[];
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
}

export const masterInitialState: IMasterState = {
    movieTheaters: [],
    screeningEvents: []
};

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.master = {
                movieTheaters: [],
                screeningEvents: []
            };
            return { ...state };
        }
        case ActionTypes.GetTheaters: {
            return { ...state, loading: true, process: '劇場情報を取得しています' };
        }
        case ActionTypes.GetTheatersSuccess: {
            const movieTheaters = action.payload.movieTheaters;
            return { ...state, loading: false, process: '', error: null, master: { ...state.master, movieTheaters } };
        }
        case ActionTypes.GetTheatersFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case ActionTypes.GetSchedule: {
            return { ...state, loading: true, process: 'スケジュールを取得しています' };
        }
        case ActionTypes.GetScheduleSuccess: {
            const screeningEvents = action.payload.screeningEvents;
            state.master.screeningEvents = screeningEvents;

            return { ...state, loading: false, process: '', error: null };
        }
        case ActionTypes.GetScheduleFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
