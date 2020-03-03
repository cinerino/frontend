import { factory } from '@cinerino/api-javascript-client';
import { IState } from '.';
import { IPrinter } from '../../models';
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
    accounts: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>[];
    /**
     * クレジットカード
     */
    creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    /**
     * 言語
     */
    language: string;
    /**
     * 販売者情報
     */
    seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    /**
     * 端末情報
     */
    pos?: factory.seller.IPOS;
    /**
     * 劇場
     */
    theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    /**
     * プリンター
     */
    printer?: IPrinter;
    /**
     * バージョン
     */
    version?: string;
}

export const userInitialState: IUserState = {
    isMember: false,
    language: 'ja',
    creditCards: [],
    accounts: []
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
            state.userData.accounts = [];
            state.userData.creditCards = [];
            return { ...state, loading: false };
        }
        case userAction.ActionTypes.Initialize: {
            state.userData.isMember = true;
            return { ...state, loading: false };
        }
        case userAction.ActionTypes.GetProfile: {
            return { ...state, loading: true, process: 'userAction.GetProfile' };
        }
        case userAction.ActionTypes.GetProfileSuccess: {
            state.userData.profile = action.payload.profile;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.GetProfileFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.GetAccount: {
            return { ...state, loading: true, process: 'userAction.GetAccount' };
        }
        case userAction.ActionTypes.GetAccountSuccess: {
            state.userData.accounts = action.payload.accounts;
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.GetAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.OpenAccount: {
            return { ...state, loading: true, process: 'userAction.OpenAccount' };
        }
        case userAction.ActionTypes.OpenAccountSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.OpenAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.CloseAccount: {
            return { ...state, loading: true, process: 'userAction.CloseAccount' };
        }
        case userAction.ActionTypes.CloseAccountSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.CloseAccountFail: {
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
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.RemoveCreditCardFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.ChargeAccount: {
            return { ...state, loading: true, process: 'userAction.ChargeAccount' };
        }
        case userAction.ActionTypes.ChargeAccountSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.ChargeAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.TransferAccount: {
            return { ...state, loading: true, process: 'userAction.TransferAccount' };
        }
        case userAction.ActionTypes.TransferAccountSuccess: {
            return { ...state, loading: false, process: '', error: null };
        }
        case userAction.ActionTypes.TransferAccountFail: {
            const error = action.payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }
        case userAction.ActionTypes.UpdateBaseSetting: {
            state.userData.seller = action.payload.seller;
            state.userData.pos = action.payload.pos;
            state.userData.theater = action.payload.theater;
            state.userData.printer = action.payload.printer;
            return { ...state };
        }
        case userAction.ActionTypes.SetVersion: {
            state.userData.version = action.payload.version;
            return { ...state };
        }
        default: {
            return state;
        }
    }
}
