import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[User] User',
    Create = '[User] Create',
    CreateSuccess = '[User] Create Success',
    CreateFail = '[User] Create Fail',
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
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
    constructor(public payload: {}) { }
}

/**
 * CreateFail
 */
export class CreateFail implements Action {
    public readonly type = ActionTypes.CreateFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | Create
    | CreateSuccess
    | CreateFail;
