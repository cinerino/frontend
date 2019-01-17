import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';
import * as reducer from './reducer';

/**
 * State and reducer
 */
export {
    IState,
    IPurchaseState,
    IInquiryState,
    IUserState,
    reducer
} from './reducer';

/**
 * Selectors
 */
export const getFeatureState = createFeatureSelector<reducer.IState>('App');
export const getLoading = createSelector(getFeatureState, reducer.getLoading);
export const getProcess = createSelector(getFeatureState, reducer.getProcess);
export const getError = createSelector(getFeatureState, reducer.getError);
export const getPurchase = createSelector(getFeatureState, reducer.getPurchase);
export const getInquiry = createSelector(getFeatureState, reducer.getInquiry);
export const getUser = createSelector(getFeatureState, reducer.getUser);
