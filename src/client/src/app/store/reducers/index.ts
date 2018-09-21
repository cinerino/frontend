import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';
import * as reducer from './reducer';

/**
 * State and reducer
 */
export { IState, IPurchaseState, reducer } from './reducer';

/**
 * Selectors
 */
export const getFeatureState = createFeatureSelector<reducer.IState>('App');
export const getLoading = createSelector(getFeatureState, reducer.getLoading);
export const getError = createSelector(getFeatureState, reducer.getError);
export const getPurchase = createSelector(getFeatureState, reducer.getPurchase);
