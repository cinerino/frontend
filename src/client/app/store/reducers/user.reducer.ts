import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { environment } from '../../../environments/environment';
import { ViewType } from '../../models';
import { Actions, ActionTypes } from '../actions/user.action';

export interface IUserState {
    isMember: boolean;
    userName?: string;
    profile?: factory.person.IProfile;
    language: string;
    limitedPurchaseCount: number;
    viewType: ViewType;
}

export const userInitialState: IUserState = {
    isMember: false,
    language: 'ja',
    limitedPurchaseCount: Number(environment.LIMITED_PURCHASE_COUNT),
    viewType: environment.VIEW_TYPE
};
/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: Actions): IState {
    switch (action.type) {
        case ActionTypes.Delete: {
            state.userData.isMember = false;
            state.userData.profile = undefined;
            return { ...state, loading: false };
        }
        case ActionTypes.Initialize: {
            state.userData.isMember = true;
            return { ...state, loading: false };
        }
        case ActionTypes.Create: {
            return { ...state, loading: true, process: { ja: '会員情報を取得しています', en: 'Acquiring member information' }, };
        }
        case ActionTypes.CreateSuccess: {
            const profile = action.payload.profile;
            state.userData.profile = profile;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.CreateFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdateLanguage: {
            state.userData.language = action.payload.language;
            return { ...state };
        }
        case ActionTypes.UpdateCustomer: {
            return { ...state, loading: true, process: { ja: '会員情報を更新しています', en: 'Updating member information' }, };
        }
        case ActionTypes.UpdateCustomerSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.UpdateCustomerFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdatePayment: {
            return { ...state, loading: true, process: { ja: '決済情報を更新しています', en: 'Updating settlement information' }, };
        }
        case ActionTypes.UpdatePaymentSuccess: {
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.UpdatePaymentFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdateBaseSetting: {
            state.userData.limitedPurchaseCount = action.payload.limitedPurchaseCount;
            state.userData.viewType = action.payload.viewType;
            return { ...state };
        }
        default: {
            return state;
        }
    }
}
