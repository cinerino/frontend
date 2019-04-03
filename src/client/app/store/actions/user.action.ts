import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { ViewType } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[User] Delete',
    Initialize = '[User] Initialize',
    InitializeProfile = '[User] Initialize Profile',
    InitializeProfileSuccess = '[User] Initialize Profile Success',
    InitializeProfileFail = '[User] Initialize Profile Fail',
    InitializeCoinAccount = '[User] Initialize Coin Account',
    InitializeCoinAccountSuccess = '[User] Initialize Coin Account Success',
    InitializeCoinAccountFail = '[User] Initialize Coin Account Fail',
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
    ChargeCoin = '[User] Charge Coin',
    ChargeCoinSuccess = '[User] Charge Coin Success',
    ChargeCoinFail = '[User] Charge Coin Fail'
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
 * プロフィール初期化
 */
export class InitializeProfile implements Action {
    public readonly type = ActionTypes.InitializeProfile;
    constructor(public payload?: {}) { }
}

/**
 * プロフィール初期化成功
 */
export class InitializeProfileSuccess implements Action {
    public readonly type = ActionTypes.InitializeProfileSuccess;
    constructor(public payload: {
        profile: factory.person.IProfile;
    }) { }
}

/**
 * プロフィール初期化失敗
 */
export class InitializeProfileFail implements Action {
    public readonly type = ActionTypes.InitializeProfileFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * コイン口座初期化
 */
export class InitializeCoinAccount implements Action {
    public readonly type = ActionTypes.InitializeCoinAccount;
    constructor(public payload?: {}) { }
}

/**
 * コイン口座初期化成功
 */
export class InitializeCoinAccountSuccess implements Action {
    public readonly type = ActionTypes.InitializeCoinAccountSuccess;
    constructor(public payload: {
        coin: {
            account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;
        }
    }) { }
}

/**
 * コイン口座初期化失敗
 */
export class InitializeCoinAccountFail implements Action {
    public readonly type = ActionTypes.InitializeCoinAccountFail;
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
    constructor(public payload: { purchaseCartMaxLength: number, viewType: ViewType }) { }
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
 * コイン口座入金
 */
export class ChargeCoin implements Action {
    public readonly type = ActionTypes.ChargeCoin;
    constructor(public payload?: {}) { }
}

/**
 * コイン口座入金成功
 */
export class ChargeCoinSuccess implements Action {
    public readonly type = ActionTypes.ChargeCoinSuccess;
    constructor(public payload: {}) { }
}

/**
 * コイン口座入金失敗
 */
export class ChargeCoinFail implements Action {
    public readonly type = ActionTypes.ChargeCoinFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | Initialize
    | InitializeProfile
    | InitializeProfileSuccess
    | InitializeProfileFail
    | InitializeCoinAccount
    | InitializeCoinAccountSuccess
    | InitializeCoinAccountFail
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
    | ChargeCoin
    | ChargeCoinSuccess
    | ChargeCoinFail;
