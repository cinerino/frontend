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
    UpdatePayment = '[User] Update Payment',
    UpdatePaymentSuccess = '[User] Update Payment Success',
    UpdatePaymentFail = '[User] Update Payment Fail',
    UpdateBaseSetting = '[User] Update Base Setting'
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
    constructor(public payload: { limitedPurchaseCount: number, viewType: ViewType }) { }
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
 * 決済情報更新
 */
export class UpdatePayment implements Action {
    public readonly type = ActionTypes.UpdatePayment;
    constructor(public payload?: {}) { }
}

/**
 * 決済情報更新成功
 */
export class UpdatePaymentSuccess implements Action {
    public readonly type = ActionTypes.UpdatePaymentSuccess;
    constructor(public payload: {}) { }
}

/**
 * 決済情報更新失敗
 */
export class UpdatePaymentFail implements Action {
    public readonly type = ActionTypes.UpdatePaymentFail;
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
    | UpdatePayment
    | UpdatePaymentSuccess
    | UpdatePaymentFail
    | UpdateBaseSetting;
