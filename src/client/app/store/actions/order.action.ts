import { ISearchResult } from '@cinerino/api-abstract-client/lib/service';
import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { IPrinter } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Order] Delete',
    Search = '[Order] Search',
    SearchSuccess = '[Order] Search Success',
    SearchFail = '[Order] Search Fail',
    Cancel = '[Order] Cancel',
    CancelSuccess = '[Order] Cancel Success',
    CancelFail = '[Order] Cancel Fail',
    Inquiry = '[Order] Inquiry',
    InquirySuccess = '[Order] Inquiry Success',
    InquiryFail = '[Order] Inquiry Fail',
    Print = '[Order] Print',
    PrintSuccess = '[Order] Print Success',
    PrintFail = '[Order] Print Fail',
    OrderAuthorize = '[Order] Order Authorize',
    OrderAuthorizeSuccess = '[Order] Order Authorize Success',
    OrderAuthorizeFail = '[Order] Order Authorize Fail'
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * Search
 */
export class Search implements Action {
    public readonly type = ActionTypes.Search;
    constructor(public payload: {
        params: factory.order.ISearchConditions
    }) { }
}

/**
 * SearchSuccess
 */
export class SearchSuccess implements Action {
    public readonly type = ActionTypes.SearchSuccess;
    constructor(public payload: {
        searchResult: ISearchResult<factory.order.IOrder[]>,
        limit: number;
    }) { }
}

/**
 * SearchFail
 */
export class SearchFail implements Action {
    public readonly type = ActionTypes.SearchFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Cancel
 */
export class Cancel implements Action {
    public readonly type = ActionTypes.Cancel;
    constructor(public payload: {
        orders: factory.order.IOrder[]
    }) { }
}

/**
 * CancelSuccess
 */
export class CancelSuccess implements Action {
    public readonly type = ActionTypes.CancelSuccess;
    constructor(public payload?: { }) { }
}

/**
 * CancelFail
 */
export class CancelFail implements Action {
    public readonly type = ActionTypes.CancelFail;
    constructor(public payload: { error: Error }) { }
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
 * Print
 */
export class Print implements Action {
    public readonly type = ActionTypes.Print;
    constructor(public payload: {
        orders: factory.order.IOrder[];
        printer: IPrinter;
        pos?: factory.seller.IPOS;
        timeout?: number;
    }) { }
}

/**
 * PrintSuccess
 */
export class PrintSuccess implements Action {
    public readonly type = ActionTypes.PrintSuccess;
    constructor(public payload?: {}) { }
}

/**
 * PrintFail
 */
export class PrintFail implements Action {
    public readonly type = ActionTypes.PrintFail;
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
    | Search
    | SearchSuccess
    | SearchFail
    | Cancel
    | CancelSuccess
    | CancelFail
    | Inquiry
    | InquirySuccess
    | InquiryFail
    | Print
    | PrintSuccess
    | PrintFail
    | OrderAuthorize
    | OrderAuthorizeSuccess
    | OrderAuthorizeFail;
