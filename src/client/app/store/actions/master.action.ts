import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Master] Delete',
    GetTheaters = '[Master] Get Theaters',
    GetTheatersSuccess = '[Master] Get Theaters Success',
    GetTheatersFail = '[Master] Get Theaters Fail',
    GetSchedule = '[Master] Get Schedule',
    GetScheduleSuccess = '[Master] Get Schedule Success',
    GetScheduleFail = '[Master] Get Schedule Fail'
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * GetTheaters
 */
export class GetTheaters implements Action {
    public readonly type = ActionTypes.GetTheaters;
    constructor(public payload: { params: factory.organization.ISearchConditions<factory.organizationType.MovieTheater> }) { }
}

/**
 * GetTheatersSuccess
 */
export class GetTheatersSuccess implements Action {
    public readonly type = ActionTypes.GetTheatersSuccess;
    constructor(public payload: { movieTheaters: factory.organization.IOrganization<factory.organizationType.MovieTheater>[] }) { }
}

/**
 * GetTheatersFail
 */
export class GetTheatersFail implements Action {
    public readonly type = ActionTypes.GetTheatersFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * GetSchedule
 */
export class GetSchedule implements Action {
    public readonly type = ActionTypes.GetSchedule;
    constructor(public payload: {
        movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater>;
        scheduleDate: string;
    }) { }
}

/**
 * GetScheduleSuccess
 */
export class GetScheduleSuccess implements Action {
    public readonly type = ActionTypes.GetScheduleSuccess;
    constructor(public payload: {
        screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
        scheduleDate: string;
    }) { }
}

/**
 * GetScheduleFail
 */
export class GetScheduleFail implements Action {
    public readonly type = ActionTypes.GetScheduleFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | GetTheaters
    | GetTheatersSuccess
    | GetTheatersFail
    | GetSchedule
    | GetScheduleSuccess
    | GetScheduleFail;
