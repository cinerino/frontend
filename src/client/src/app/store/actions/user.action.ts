import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[User] User',
    Load = '[User] Load',
    LoadSuccess = '[User] Load Success',
    LoadFail = '[User] Load Fail',
    Create = '[User] Create',
    CreateSuccess = '[User] Create Success',
    CreateFail = '[User] Create Fail',
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload: {}) { }
}

/**
 * Load
 */
export class Load implements Action {
    public readonly type = ActionTypes.Load;
    constructor(public payload: {}) { }
}

/**
 * LoadSuccess
 */
export class LoadSuccess implements Action {
    public readonly type = ActionTypes.LoadSuccess;
    constructor(public payload: {}) { }
}

/**
 * LoadFail
 */
export class LoadFail implements Action {
    public readonly type = ActionTypes.LoadFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Create
 */
export class Create implements Action {
    public readonly type = ActionTypes.Create;
    constructor(public payload: {}) { }
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
    | Load
    | LoadSuccess
    | LoadFail
    | Create
    | CreateSuccess
    | CreateFail;
