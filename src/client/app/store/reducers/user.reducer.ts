import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { environment } from '../../../environments/environment';
import { ViewType } from '../../models';
import { userAction } from '../actions';

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
    purchaseCartMaxLength: number;
    /**
     * 表示形式
     */
    viewType: ViewType;
}

export const userInitialState: IUserState = {
    isMember: false,
    language: 'ja',
    purchaseCartMaxLength: Number(environment.PURCHASE_CART_MAX_LENGTH),
    viewType: environment.VIEW_TYPE,
    creditCards: []
};
/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state: IState, action: userAction.Actions): IState {
    switch (action.type) {
        case userAction.ActionTypes.Delete: {
            state.userData.isMember = false;
            state.userData.profile = undefined;
            state.userData.coin = undefined;
            state.userData.creditCards = [];
            return { ...state, loading: false };
        }
        case userAction.ActionTypes.Initialize: {
            state.userData.isMember = true;
            return { ...state, loading: false };
        }
        case userAction.ActionTypes.InitializeProfile: {
            return { ...state, loading: true, process: 'userAction.InitializeProfile' };
        }
        case userAction.ActionTypes.InitializeProfileSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.InitializeProfileFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.InitializeCoinAccount: {
            return { ...state, loading: true, process: 'userAction.InitializeCoinAccount' };
        }
        case userAction.ActionTypes.InitializeCoinAccountSuccess: {
            state.userData.coin = action.payload.coin;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.InitializeCoinAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.UpdateLanguage: {
            state.userData.language = action.payload.language;
            return { ...state };
        }
        case userAction.ActionTypes.UpdateProfile: {
            return { ...state, loading: true, process: 'userAction.UpdateProfile' };
        }
        case userAction.ActionTypes.UpdateProfileSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.UpdateProfileFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.GetCreditCards: {
            return { ...state, loading: true, process: 'userAction.GetCreditCards' };
        }
        case userAction.ActionTypes.GetCreditCardsSuccess: {
            const creditCards = action.payload.creditCards;
            state.userData.creditCards = creditCards;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.GetCreditCardsFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.AddCreditCard: {
            return { ...state, loading: true, process: 'userAction.AddCreditCard' };
        }
        case userAction.ActionTypes.AddCreditCardSuccess: {
            const creditCard = action.payload.creditCard;
            const findResult = state.userData.creditCards.find(c => c.cardSeq === creditCard.cardSeq);
            if (findResult === undefined) {
                state.userData.creditCards.push(creditCard);
            }
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.AddCreditCardFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.RemoveCreditCard: {
            return { ...state, loading: true, process: 'userAction.RemoveCreditCard' };
        }
        case userAction.ActionTypes.RemoveCreditCardSuccess: {
            const creditCard = action.payload.creditCard;
            const findIndexResult = state.userData.creditCards.findIndex(c => c.cardSeq === creditCard.cardSeq);
            if (findIndexResult > -1) {
                state.userData.creditCards.splice(findIndexResult, 1);
            }
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.RemoveCreditCardFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.UpdateBaseSetting: {
            state.userData.purchaseCartMaxLength = action.payload.purchaseCartMaxLength;
            state.userData.viewType = action.payload.viewType;
            return { ...state };
        }
        default: {
            return state;
        }
    }
}
