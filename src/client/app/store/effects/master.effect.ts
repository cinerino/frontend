import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { sleep } from '../../functions';
import { CinerinoService } from '../../services/cinerino.service';
import { masterAction } from '../actions';

/**
 * Master Effects
 */
@Injectable()
export class MasterEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService
    ) { }

    /**
     * GetProjects
     */
    @Effect()
    public GetProjects = this.actions.pipe(
        ofType<masterAction.GetProjects>(masterAction.ActionTypes.GetProjects),
        map(action => action.payload),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                const limit = 100;
                let page = 1;
                let roop = true;
                let projects: factory.project.IProject[] = [];
                while (roop) {
                    const searchResult = await this.cinerino.project.search({
                        page,
                        limit,
                    });
                    projects = projects.concat(searchResult.data);
                    page++;
                    roop = searchResult.data.length > 0;
                    await sleep(500);
                }

                return new masterAction.GetProjectsSuccess({ projects });
            } catch (error) {
                return new masterAction.GetProjectsFail({ error: error });
            }
        })
    );
}
