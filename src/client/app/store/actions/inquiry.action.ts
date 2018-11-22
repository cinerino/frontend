import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Inquiry] Delete',
    Inquiry = '[Inquiry] Inquiry',
    InquirySuccess = '[Inquiry] Inquiry Success',
    InquiryFail = '[Inquiry] Inquiry Fail'
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
 * Actions
 */
export type Actions =
    | Delete
    | Inquiry
    | InquirySuccess
    | InquiryFail;
