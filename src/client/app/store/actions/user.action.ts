import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { ViewType } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[User] Delete',
    Initialize = '[User] Initialize',
    Create = '[User] Create',
    CreateSuccess = '[User] Create Success',
    CreateFail = '[User] Create Fail',
    UpdateLanguage = '[User] Update Language',
    UpdateCustomer = '[User] Update Customer',
    UpdateCustomerSuccess = '[User] Update Customer Success',
    UpdateCustomerFail = '[User] Update Customer Fail',
    UpdatePayment = '[User] Update Payment',
    UpdatePaymentSuccess = '[User] Update Payment Success',
    UpdatePaymentFail = '[User] Update Payment Fail',
    UpdateBaseSetting = '[User] Update Base Setting'
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * Initialize
 */
export class Initialize implements Action {
    public readonly type = ActionTypes.Initialize;
    constructor(public payload?: {}) { }
}

/**
 * Create
 */
export class Create implements Action {
    public readonly type = ActionTypes.Create;
    constructor(public payload?: {}) { }
}

/**
 * CreateSuccess
 */
export class CreateSuccess implements Action {
    public readonly type = ActionTypes.CreateSuccess;
    constructor(public payload: { profile: factory.person.IProfile }) { }
}

/**
 * CreateFail
 */
export class CreateFail implements Action {
    public readonly type = ActionTypes.CreateFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * UpdateLanguage
 */
export class UpdateLanguage implements Action {
    public readonly type = ActionTypes.UpdateLanguage;
    constructor(public payload: { language: string }) { }
}

/**
 * UpdateBaseSetting
 */
export class UpdateBaseSetting implements Action {
    public readonly type = ActionTypes.UpdateBaseSetting;
    constructor(public payload: { limitedPurchaseCount: number, viewType: ViewType }) { }
}

/**
 * UpdateCustomer
 */
export class UpdateCustomer implements Action {
    public readonly type = ActionTypes.UpdateCustomer;
    constructor(public payload: { profile: factory.person.IProfile }) { }
}

/**
 * UpdateCustomerSuccess
 */
export class UpdateCustomerSuccess implements Action {
    public readonly type = ActionTypes.UpdateCustomerSuccess;
    constructor(public payload: { profile: factory.person.IProfile }) { }
}

/**
 * UpdateCustomerFail
 */
export class UpdateCustomerFail implements Action {
    public readonly type = ActionTypes.UpdateCustomerFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * UpdatePayment
 */
export class UpdatePayment implements Action {
    public readonly type = ActionTypes.UpdatePayment;
    constructor(public payload?: {}) { }
}

/**
 * UpdatePaymentSuccess
 */
export class UpdatePaymentSuccess implements Action {
    public readonly type = ActionTypes.UpdatePaymentSuccess;
    constructor(public payload: {}) { }
}

/**
 * UpdatePaymentFail
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
    | Create
    | CreateSuccess
    | CreateFail
    | UpdateLanguage
    | UpdateCustomer
    | UpdateCustomerSuccess
    | UpdateCustomerFail
    | UpdatePayment
    | UpdatePaymentSuccess
    | UpdatePaymentFail
    | UpdateBaseSetting;
