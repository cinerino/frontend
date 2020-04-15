import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Master] Delete',
    GetProjects = '[Master] Get Projects',
    GetProjectsSuccess = '[Master] Get Projects Success',
    GetProjectsFail = '[Master] Get Projects Fail'
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * GetProjects
 */
export class GetProjects implements Action {
    public readonly type = ActionTypes.GetProjects;
    constructor(public payload?: {}) { }
}

/**
 * GetProjectsSuccess
 */
export class GetProjectsSuccess implements Action {
    public readonly type = ActionTypes.GetProjectsSuccess;
    constructor(public payload: {
        projects: factory.project.IProject[]
    }) { }
}

/**
 * GetProjectsFail
 */
export class GetProjectsFail implements Action {
    public readonly type = ActionTypes.GetProjectsFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | GetProjects
    | GetProjectsSuccess
    | GetProjectsFail;
