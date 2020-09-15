import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { Functions } from '../..';
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
        ofType(masterAction.getProjects),
        map(action => action),
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
                    roop = searchResult.data.length === limit;
                    if (roop) {
                        await Functions.Util.sleep();
                    }
                }

                return masterAction.getProjectsSuccess({ projects });
            } catch (error) {
                return masterAction.getProjectsFail({ error: error });
            }
        })
    );
}
