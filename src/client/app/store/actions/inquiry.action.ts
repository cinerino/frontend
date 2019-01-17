import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Inquiry] Delete',
    Inquiry = '[Inquiry] Inquiry',
    InquirySuccess = '[Inquiry] Inquiry Success',
    InquiryFail = '[Inquiry] Inquiry Fail',
    GetPurchaseHistory = '[Inquiry] Get Purchase History',
    GetPurchaseHistorySuccess = '[Inquiry] Get Purchase History Success',
    GetPurchaseHistoryFail = '[Inquiry] Get Purchase History Fail',
    OrderAuthorize = '[Inquiry] Order Authorize',
    OrderAuthorizeSuccess = '[Inquiry] Order Authorize Success',
    OrderAuthorizeFail = '[Inquiry] Order Authorize Fail',
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * Inquiry
 */
export class Inquiry implements Action {
    public readonly type = ActionTypes.Inquiry;
    constructor(public payload: {
        confirmationNumber: number;
        customer: {
            email?: string;
            telephone?: string;
        };
    }) { }
}

/**
 * InquirySuccess
 */
export class InquirySuccess implements Action {
    public readonly type = ActionTypes.InquirySuccess;
    constructor(public payload: { order: factory.order.IOrder }) { }
}

/**
 * InquiryFail
 */
export class InquiryFail implements Action {
    public readonly type = ActionTypes.InquiryFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * GetPurchaseHistory
 */
export class GetPurchaseHistory implements Action {
    public readonly type = ActionTypes.GetPurchaseHistory;
    constructor(public payload: { params: factory.order.ISearchConditions }) { }
}

/**
 * GetPurchaseHistorySuccess
 */
export class GetPurchaseHistorySuccess implements Action {
    public readonly type = ActionTypes.GetPurchaseHistorySuccess;
    constructor(public payload: { result: factory.order.IOrder[] }) { }
}

/**
 * GetPurchaseHistoryFail
 */
export class GetPurchaseHistoryFail implements Action {
    public readonly type = ActionTypes.GetPurchaseHistoryFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * OrderAuthorize
 */
export class OrderAuthorize implements Action {
    public readonly type = ActionTypes.OrderAuthorize;
    constructor(public payload: {
        params: {
            orderNumber: string;
            customer: {
                email?: string;
                telephone?: string;
            };
        }
    }) { }
}

/**
 * OrderAuthorizeSuccess
 */
export class OrderAuthorizeSuccess implements Action {
    public readonly type = ActionTypes.OrderAuthorizeSuccess;
    constructor(public payload: { order: factory.order.IOrder }) { }
}

/**
 * OrderAuthorizeFail
 */
export class OrderAuthorizeFail implements Action {
    public readonly type = ActionTypes.OrderAuthorizeFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | Inquiry
    | InquirySuccess
    | InquiryFail
    | GetPurchaseHistory
    | GetPurchaseHistorySuccess
    | GetPurchaseHistoryFail
    | OrderAuthorize
    | OrderAuthorizeSuccess
    | OrderAuthorizeFail;
