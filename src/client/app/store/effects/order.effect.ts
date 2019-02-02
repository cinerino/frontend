import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { formatTelephone } from '../../functions';
import { CinerinoService } from '../../services';
import * as orderAction from '../actions/order.action';

/**
 * Order Effects
 */
@Injectable()
export class OrderEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService
    ) { }

    /**
     * Search
     */
    @Effect()
    public search = this.actions.pipe(
        ofType<orderAction.Search>(orderAction.ActionTypes.Search),
        map(action => action.payload),
        mergeMap(async (payload) => {
            await this.cinerino.getServices();
            const params = payload.params;
            try {
                // if (params.customer !== undefined
                //     && params.customer.telephone !== undefined) {
                //     params.customer.telephone = formatTelephone(params.customer.telephone)
                // }
                const searchResult = await this.cinerino.person.searchOrders({...params, personId: 'me'});
                const limit = <number>params.limit;
                return new orderAction.SearchSuccess({ searchResult, limit });
            } catch (error) {
                return new orderAction.SearchFail({ error: error });
            }
        })
    );

    /**
     * Cancel
     */
    @Effect()
    public cancel = this.actions.pipe(
        ofType<orderAction.Cancel>(orderAction.ActionTypes.Cancel),
        map(action => action.payload),
        mergeMap(async (payload) => {
            await this.cinerino.getServices();
            const order = payload.order;
            try {
                console.log(order);
                return new orderAction.CancelSuccess();
            } catch (error) {
                return new orderAction.CancelFail({ error: error });
            }
        })
    );

    /**
     * Inquiry
     */
    @Effect()
    public load = this.actions.pipe(
        ofType<orderAction.Inquiry>(orderAction.ActionTypes.Inquiry),
        map(action => action.payload),
        mergeMap(async (payload) => {
            await this.cinerino.getServices();
            const confirmationNumber = payload.confirmationNumber;
            const customer = {
                telephone: (payload.customer.telephone === undefined)
                    ? '' : formatTelephone(payload.customer.telephone)
            };
            try {
                const order = await this.cinerino.order.findByConfirmationNumber({
                    confirmationNumber, customer
                });

                return new orderAction.InquirySuccess({ order });
            } catch (error) {
                return new orderAction.InquiryFail({ error: error });
            }
        })
    );

    /**
     * orderAuthorize
     */
    @Effect()
    public orderAuthorize = this.actions.pipe(
        ofType<orderAction.OrderAuthorize>(orderAction.ActionTypes.OrderAuthorize),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = Object.assign({ personId: 'me' }, payload.params);
                await this.cinerino.getServices();
                const order = await this.cinerino.order.authorizeOwnershipInfos(params);
                return new orderAction.OrderAuthorizeSuccess({ order });
            } catch (error) {
                return new orderAction.OrderAuthorizeFail({ error: error });
            }
        })
    );

}
