import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { masterAction } from '../actions';

/**
 * IMasterState
 */
export interface IMasterState {
    sellers: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>[];
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
}

export const masterInitialState: IMasterState = {
    sellers: [],
    screeningEvents: []
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
                sellers: [],
                screeningEvents: []
            };
            return { ...state };
        }
        case masterAction.ActionTypes.GetSellers: {
            return { ...state, loading: true, process: { ja: '劇場情報を取得しています', en: 'Acquiring theater information' } };
        }
        case masterAction.ActionTypes.GetSellersSuccess: {
            const sellers = action.payload.sellers;
            state.masterData.sellers = sellers;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case masterAction.ActionTypes.GetSellersFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case masterAction.ActionTypes.GetSchedule: {
            return { ...state, loading: true, process: { ja: 'スケジュールを取得しています', en: 'Acquiring a schedule' } };
        }
        case masterAction.ActionTypes.GetScheduleSuccess: {
            const screeningEvents = action.payload.screeningEvents;
            state.masterData.screeningEvents = screeningEvents;

            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case masterAction.ActionTypes.GetScheduleFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        default: {
            return state;
        }
    }
}
