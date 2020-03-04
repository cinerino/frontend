import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { IPrinter } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[User] Delete',
    Initialize = '[User] Initialize',
    GetProfile = '[User] Get Profile',
    GetProfileSuccess = '[User] Get Profile Success',
    GetProfileFail = '[User] Get Profile Fail',
    GetAccount = '[User] Get Account',
    GetAccountSuccess = '[User] Get Account Success',
    GetAccountFail = '[User] Get Account Fail',
    OpenAccount = '[User] Open Account',
    OpenAccountSuccess = '[User] Open Account Success',
    OpenAccountFail = '[User] Open Account Fail',
    CloseAccount = '[User] Close Account',
    CloseAccountSuccess = '[User] Close Account Success',
    CloseAccountFail = '[User] Close Account Fail',
    UpdateLanguage = '[User] Update Language',
    UpdateProfile = '[User] Update Customer',
    UpdateProfileSuccess = '[User] Update Customer Success',
    UpdateProfileFail = '[User] Update Customer Fail',
    GetCreditCards = '[User] Get Credit Cards',
    GetCreditCardsSuccess = '[User] Get Credit Cards Success',
    GetCreditCardsFail = '[User] Get Credit Cards Fail',
    AddCreditCard = '[User] Add Credit Card',
    AddCreditCardSuccess = '[User] Add Credit Card Success',
    AddCreditCardFail = '[User] Add Credit Card Fail',
    RemoveCreditCard = '[User] Remove Credit Card',
    RemoveCreditCardSuccess = '[User] Remove Credit Card Success',
    RemoveCreditCardFail = '[User] Remove Credit Card Fail',
    UpdateBaseSetting = '[User] Update Base Setting',
    ChargeAccount = '[User] Charge Account',
    ChargeAccountSuccess = '[User] Charge Account Success',
    ChargeAccountFail = '[User] Charge Account Fail',
    TransferAccount = '[User] Transfer Account',
    TransferAccountSuccess = '[User] Transfer Account Success',
    TransferAccountFail = '[User] Transfer Account Fail',
    SetVersion = '[User] Set Version',
}

/**
 * ユーザーデータ削除
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * ユーザーデータ初期化
 */
export class Initialize implements Action {
    public readonly type = ActionTypes.Initialize;
    constructor(public payload?: {}) { }
}

/**
 * プロフィール取得
 */
export class GetProfile implements Action {
    public readonly type = ActionTypes.GetProfile;
    constructor(public payload?: {}) { }
}

/**
 * プロフィール取得成功
 */
export class GetProfileSuccess implements Action {
    public readonly type = ActionTypes.GetProfileSuccess;
    constructor(public payload: {
        profile: factory.person.IProfile;
    }) { }
}

/**
 * プロフィール取得失敗
 */
export class GetProfileFail implements Action {
    public readonly type = ActionTypes.GetProfileFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 口座取得
 */
export class GetAccount implements Action {
    public readonly type = ActionTypes.GetAccount;
    constructor(public payload?: {}) { }
}

/**
 * 口座取得成功
 */
export class GetAccountSuccess implements Action {
    public readonly type = ActionTypes.GetAccountSuccess;
    constructor(public payload: {
        accounts: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>[];
    }) { }
}

/**
 * 口座取得失敗
 */
export class GetAccountFail implements Action {
    public readonly type = ActionTypes.GetAccountFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 口座開設
 */
export class OpenAccount implements Action {
    public readonly type = ActionTypes.OpenAccount;
    constructor(public payload: {
        name: string;
        accountType: factory.accountType;
    }) { }
}

/**
 * 口座開設成功
 */
export class OpenAccountSuccess implements Action {
    public readonly type = ActionTypes.OpenAccountSuccess;
    constructor(public payload: {
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
    }) { }
}

/**
 * 口座開設失敗
 */
export class OpenAccountFail implements Action {
    public readonly type = ActionTypes.OpenAccountFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 口座閉鎖
 */
export class CloseAccount implements Action {
    public readonly type = ActionTypes.CloseAccount;
    constructor(public payload: { account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>> }) { }
}

/**
 * 口座閉鎖成功
 */
export class CloseAccountSuccess implements Action {
    public readonly type = ActionTypes.CloseAccountSuccess;
    constructor(public payload?: {}) { }
}

/**
 * 口座閉鎖失敗
 */
export class CloseAccountFail implements Action {
    public readonly type = ActionTypes.CloseAccountFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 言語更新
 */
export class UpdateLanguage implements Action {
    public readonly type = ActionTypes.UpdateLanguage;
    constructor(public payload: { language: string }) { }
}

/**
 * 基本設定更新
 */
export class UpdateBaseSetting implements Action {
    public readonly type = ActionTypes.UpdateBaseSetting;
    constructor(public payload: {
        seller?: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        pos?: factory.seller.IPOS;
        theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        printer?: IPrinter;
    }) { }
}

/**
 * 購入者情報更新
 */
export class UpdateProfile implements Action {
    public readonly type = ActionTypes.UpdateProfile;
    constructor(public payload: { profile: factory.person.IProfile }) { }
}

/**
 * 購入者情報更新成功
 */
export class UpdateProfileSuccess implements Action {
    public readonly type = ActionTypes.UpdateProfileSuccess;
    constructor(public payload: { profile: factory.person.IProfile }) { }
}

/**
 * 購入者情報更新失敗
 */
export class UpdateProfileFail implements Action {
    public readonly type = ActionTypes.UpdateProfileFail;
    constructor(public payload: { error: Error }) { }
}
/**
 * クレジットカード取得
 */
export class GetCreditCards implements Action {
    public readonly type = ActionTypes.GetCreditCards;
    constructor(public payload?: {}) { }
}

/**
 * クレジットカード取得成功
 */
export class GetCreditCardsSuccess implements Action {
    public readonly type = ActionTypes.GetCreditCardsSuccess;
    constructor(public payload: { creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[] }) { }
}

/**
 * クレジットカード取得失敗
 */
export class GetCreditCardsFail implements Action {
    public readonly type = ActionTypes.GetCreditCardsFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * クレジットカード追加
 */
export class AddCreditCard implements Action {
    public readonly type = ActionTypes.AddCreditCard;
    constructor(public payload: {
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        },
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    }) { }
}

/**
 * クレジットカード追加成功
 */
export class AddCreditCardSuccess implements Action {
    public readonly type = ActionTypes.AddCreditCardSuccess;
    constructor(public payload: { creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard }) { }
}

/**
 * クレジットカード追加失敗
 */
export class AddCreditCardFail implements Action {
    public readonly type = ActionTypes.AddCreditCardFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * クレジットカード削除
 */
export class RemoveCreditCard implements Action {
    public readonly type = ActionTypes.RemoveCreditCard;
    constructor(public payload: { creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard }) { }
}

/**
 * クレジットカード削除成功
 */
export class RemoveCreditCardSuccess implements Action {
    public readonly type = ActionTypes.RemoveCreditCardSuccess;
    constructor(public payload: { creditCard: factory.paymentMethod.paymentCard.creditCard.ICheckedCard }) { }
}

/**
 * クレジットカード削除失敗
 */
export class RemoveCreditCardFail implements Action {
    public readonly type = ActionTypes.RemoveCreditCardFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 口座入金
 */
export class ChargeAccount implements Action {
    public readonly type = ActionTypes.ChargeAccount;
    constructor(public payload: {
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        profile: factory.person.IProfile;
        amount: number;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
        creditCard: factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember;
    }) { }
}

/**
 * 口座入金成功
 */
export class ChargeAccountSuccess implements Action {
    public readonly type = ActionTypes.ChargeAccountSuccess;
    constructor(public payload: {}) { }
}

/**
 * 口座入金失敗
 */
export class ChargeAccountFail implements Action {
    public readonly type = ActionTypes.ChargeAccountFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * 口座転送
 */
export class TransferAccount implements Action {
    public readonly type = ActionTypes.TransferAccount;
    constructor(public payload: {
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
        profile: factory.person.IProfile;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
        amount: number;
        description: string;
        accountNumber: string
    }) { }
}

/**
 * 口座転送成功
 */
export class TransferAccountSuccess implements Action {
    public readonly type = ActionTypes.TransferAccountSuccess;
    constructor(public payload: {}) { }
}

/**
 * 口座転送失敗
 */
export class TransferAccountFail implements Action {
    public readonly type = ActionTypes.TransferAccountFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * バージョン設定
 */
export class SetVersion implements Action {
    public readonly type = ActionTypes.SetVersion;
    constructor(public payload: { version: string }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | Initialize
    | GetProfile
    | GetProfileSuccess
    | GetProfileFail
    | GetAccount
    | GetAccountSuccess
    | GetAccountFail
    | OpenAccount
    | OpenAccountSuccess
    | OpenAccountFail
    | CloseAccount
    | CloseAccountSuccess
    | CloseAccountFail
    | UpdateLanguage
    | UpdateProfile
    | UpdateProfileSuccess
    | UpdateProfileFail
    | GetCreditCards
    | GetCreditCardsSuccess
    | GetCreditCardsFail
    | AddCreditCard
    | AddCreditCardSuccess
    | AddCreditCardFail
    | RemoveCreditCard
    | RemoveCreditCardSuccess
    | RemoveCreditCardFail
    | UpdateBaseSetting
    | ChargeAccount
    | ChargeAccountSuccess
    | ChargeAccountFail
    | TransferAccount
    | TransferAccountSuccess
    | TransferAccountFail
    | SetVersion;
