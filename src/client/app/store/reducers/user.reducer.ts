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
     * クレジットカード
     */
    creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
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
    viewType: environment.VIEW_TYPE,
    creditCards: []
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
            state.userData.creditCards = [];
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
        case ActionTypes.GetCreditCards: {
            return { ...state, loading: true, process: { ja: 'クレジットカード情報を取得しています', en: 'Get Credit Cards' }, };
        }
        case ActionTypes.GetCreditCardsSuccess: {
            const creditCards = action.payload.creditCards;
            state.userData.creditCards = creditCards;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.GetCreditCardsFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.AddCreditCard: {
            return { ...state, loading: true, process: { ja: 'クレジットカード情報を登録しています', en: 'Add Credit Cards' }, };
        }
        case ActionTypes.AddCreditCardSuccess: {
            const creditCard = action.payload.creditCard;
            const findResult = state.userData.creditCards.find(c => c.cardSeq === creditCard.cardSeq);
            if (findResult === undefined) {
                state.userData.creditCards.push(creditCard);
            }
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.AddCreditCardFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: { ja: '', en: '' }, error: JSON.stringify(error) };
        }
        case ActionTypes.RemoveCreditCard: {
            return { ...state, loading: true, process: { ja: 'クレジットカード情報を削除しています', en: 'Remove Credit Cards' }, };
        }
        case ActionTypes.RemoveCreditCardSuccess: {
            const creditCard = action.payload.creditCard;
            const findIndexResult = state.userData.creditCards.findIndex(c => c.cardSeq === creditCard.cardSeq);
            if (findIndexResult > -1) {
                state.userData.creditCards.splice(findIndexResult, 1);
            }
            return { ...state, loading: false, process: { ja: '', en: '' }, error: null };
        }
        case ActionTypes.RemoveCreditCardFail: {
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
