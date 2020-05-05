import { createAction, props } from '@ngrx/store';

const LABEL = '[Util]';

export const loadStart = createAction(
    `${LABEL} loadStart`,
    props<{ process: string; }>()
);

export const loadEnd = createAction(
    `${LABEL} loadEnd`,
);

export const setError = createAction(
    `${LABEL} setError`,
    props<{ error: any }>()
);
