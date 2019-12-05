import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    LoadStart = '[Util] Load Start',
    LoadEnd = '[Util] Load End',
    SetError = '[Util] Set Error'
}

/**
 * LoadStart
 */
export class LoadStart implements Action {
    public readonly type = ActionTypes.LoadStart;
    constructor(public payload?: { process: string; }) { }
}

/**
 * LoadEnd
 */
export class LoadEnd implements Action {
    public readonly type = ActionTypes.LoadEnd;
    constructor(public payload?: {}) { }
}

/**
 * SetError
 */
export class SetError implements Action {
    public readonly type = ActionTypes.SetError;
    constructor(public payload: { error: any }) { }
}

/**
 * Actions
 */
export type Actions =
    | LoadStart
    | LoadEnd
    | SetError;
