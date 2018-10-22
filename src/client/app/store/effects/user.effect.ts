import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import * as user from '../actions/user.action';

/**
 * User Effects
 */
@Injectable()
export class UserEffects {

    constructor(
        private actions: Actions
    ) { }

    /**
     * Load
     */
    @Effect()
    public load = this.actions.pipe(
        ofType<user.Load>(user.ActionTypes.Load),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                return new user.LoadSuccess({ });
            } catch (error) {
                return new user.LoadFail({ error: error });
            }
        })
    );

    /**
     * Create
     */
    @Effect()
    public create = this.actions.pipe(
        ofType<user.Create>(user.ActionTypes.Create),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                return new user.CreateSuccess({ });
            } catch (error) {
                return new user.CreateFail({ error: error });
            }
        })
    );
}
