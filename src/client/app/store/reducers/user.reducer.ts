import { factory } from '@cinerino/sdk';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { Models } from '../..';
import { userAction } from '../actions';

export interface IUserState {
    /**
     * ログイン
     */
    login: boolean;
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
    accounts: factory.ownershipInfo.IOwnershipInfo<factory.ownershipInfo.IGoodWithDetail>[];
    /**
     * クレジットカード
     */
    creditCards: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    /**
     * 言語
     */
    language: string;
    /**
     * 端末情報
     */
    pos?: factory.chevre.place.movieTheater.IPOS;
    /**
     * 劇場
     */
    theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    /**
     * プリンター
     */
    printer?: Models.Common.Printer.IPrinter;
    /**
     * バージョン
     */
    version?: string;
}

export const userInitialState: IUserState = {
    login: false,
    language: 'ja',
    creditCards: [],
    accounts: []
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(userAction.remove, state => {
            return {
                ...state,
                userData: {
                    login: false,
                    profile: undefined,
                    accounts: [],
                    creditCards: [],
                    language: 'ja'
                }, loading: false, process: ''
            };
        }),
        on(userAction.initialize, (state, payload) => {
            const login = payload.login;
            return {
                ...state, userData: {
                    ...state.userData,
                    login
                }, loading: false, process: ''
            };
        }),
        on(userAction.updateLanguage, (state, payload) => {
            const language = payload.language;
            return { ...state, userData: { ...state.userData, language } };
        }),
        on(userAction.setVersion, (state, payload) => {
            const version = payload.version;
            return { ...state, userData: { ...state.userData, version } };
        }),
        on(userAction.getProfile, (state) => {
            return { ...state, loading: true, process: 'userAction.GetProfile' };
        }),
        on(userAction.getProfileSuccess, (state, payload) => {
            const profile = payload.profile;
            return { ...state, loading: false, userData: { ...state.userData, profile } };
        }),
        on(userAction.getProfileFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.getAccount, (state) => {
            return { ...state, loading: true, process: 'userAction.GetAccount' };
        }),
        on(userAction.getAccountSuccess, (state, payload) => {
            const accounts = payload.accounts;
            return { ...state, loading: false, userData: { ...state.userData, accounts } };
        }),
        on(userAction.getAccountFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.openAccount, (state) => {
            return { ...state, loading: true, process: 'userAction.OpenAccount' };
        }),
        on(userAction.openAccountSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.openAccountFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.closeAccount, (state) => {
            return { ...state, loading: true, process: 'userAction.CloseAccount' };
        }),
        on(userAction.closeAccountSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.closeAccountFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.updateProfile, (state) => {
            return { ...state, loading: true, process: 'userAction.UpdateProfile' };
        }),
        on(userAction.updateProfileSuccess, (state, payload) => {
            const profile = payload.profile;
            return { ...state, loading: false, userData: { ...state.userData, profile } };
        }),
        on(userAction.updateProfileFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.getCreditCards, (state) => {
            return { ...state, loading: true, process: 'userAction.GetCreditCards' };
        }),
        on(userAction.getCreditCardsSuccess, (state, payload) => {
            const creditCards = payload.creditCards;
            return { ...state, loading: false, userData: { ...state.userData, creditCards } };
        }),
        on(userAction.getCreditCardsFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.addCreditCard, (state) => {
            return { ...state, loading: true, process: 'userAction.AddCreditCard' };
        }),
        on(userAction.addCreditCardSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.addCreditCardFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.removeCreditCard, (state) => {
            return { ...state, loading: true, process: 'userAction.RemoveCreditCard' };
        }),
        on(userAction.removeCreditCardSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.removeCreditCardFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.chargeAccount, (state) => {
            return { ...state, loading: true, process: 'userAction.ChargeAccount' };
        }),
        on(userAction.chargeAccountSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.chargeAccountFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.transferAccount, (state) => {
            return { ...state, loading: true, process: 'userAction.TransferAccount' };
        }),
        on(userAction.transferAccountSuccess, (state) => {
            return { ...state, loading: false, userData: { ...state.userData } };
        }),
        on(userAction.transferAccountFail, (state, payload) => {
            const error = payload.error;
            return { ...state, loading: false, process: '', error: JSON.stringify(error) };
        }),
        on(userAction.updateBaseSetting, (state, payload) => {
            return {
                ...state, userData: {
                    ...state.userData,
                    pos: payload.pos,
                    theater: payload.theater,
                    printer: payload.printer
                }
            };
        }),
    )(initialState, action);
}
