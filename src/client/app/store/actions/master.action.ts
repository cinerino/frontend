import { factory } from '@cinerino/api-javascript-client';
import { createAction, props } from '@ngrx/store';

const LABEL = '[Master]';

export const remove = createAction(
    `${LABEL} remove`,
);

export const getProjects = createAction(
    `${LABEL} getProjects`,
);

export const getProjectsSuccess = createAction(
    `${LABEL} getProjectsSuccess`,
    props<{ projects: factory.project.IProject[] }>()
);

export const getProjectsFail = createAction(
    `${LABEL} getProjectsFail`,
    props<{ error: Error }>()
);
