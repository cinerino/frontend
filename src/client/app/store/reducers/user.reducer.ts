import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { environment } from '../../../environments/environment';
import { ViewType } from '../../models';
import { Actions, ActionTypes } from '../actions/user.action';

export interface IUserState {
    /**
     * 会員フラグ
     */
    isMember: boolean;
    /**
     * ユーザーネーム
     */
    userName?: string;
    /**
     * プロフィール
     */
    profile?: factory.person.IProfile;
    /**
     * コイン口座
     */
    coin?: {
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
    };
    /**
     * 言語
     */
    language: string;
    /**
     * 購入制限数
     */
    limitedPurchaseCount: number;
    /**
     * 表示形式
     */
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
            state.userData.coin = undefined;
            return { ...state, loading: false };
        }
        case ActionTypes.Initialize: {
            state.userData.isMember = true;
            return { ...state, loading: false };
        }
        case ActionTypes.InitializeProfile: {
            return { ...state, loading: true, process: { ja: 'プロフィールを初期化しています', en: 'Initializing Profile' }, };
        }
        case ActionTypes.InitializeProfileSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.InitializeProfileFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.InitializeCoinAccount: {
            return { ...state, loading: true, process: { ja: 'コイン口座を初期化しています', en: 'Initializing Coin Account' }, };
        }
        case ActionTypes.InitializeCoinAccountSuccess: {
            state.userData.coin = action.payload.coin;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.InitializeCoinAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.UpdateLanguage: {
            state.userData.language = action.payload.language;
            return { ...state };
        }
        case ActionTypes.UpdateProfile: {
            return { ...state, loading: true, process: { ja: '会員情報を更新しています', en: 'Updating member information' }, };
        }
        case ActionTypes.UpdateProfileSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.UpdateProfileFail: {
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
