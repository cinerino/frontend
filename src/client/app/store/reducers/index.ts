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
    IHistoryState,
    IInquiryState,
    IUserState,
    reducer
} from './reducer';

/**
 * Selectors
 */
export const getFeatureState = createFeatureSelector<reducer.IState>('App');
export const getLoading = createSelector(getFeatureState, reducer.getLoading);
export const getError = createSelector(getFeatureState, reducer.getError);
export const getPurchase = createSelector(getFeatureState, reducer.getPurchase);
export const getHistory = createSelector(getFeatureState, reducer.getHistory);
export const getInquiry = createSelector(getFeatureState, reducer.getInquiry);
export const getUser = createSelector(getFeatureState, reducer.getUser);
