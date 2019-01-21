import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { formatTelephone } from '../../functions';
import { CinerinoService } from '../../services';
import * as inquiry from '../actions/inquiry.action';

/**
 * Inquiry Effects
 */
@Injectable()
export class InquiryEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService
    ) { }

    /**
     * Inquiry
     */
    @Effect()
    public load = this.actions.pipe(
        ofType<inquiry.Inquiry>(inquiry.ActionTypes.Inquiry),
        map(action => action.payload),
        mergeMap(async (payload) => {
            await this.cinerino.getServices();
            const confirmationNumber = payload.confirmationNumber;
            const customer = {
                telephone: (payload.customer.telephone === undefined)
                    ? ''
                    : formatTelephone(payload.customer.telephone)
            };
            try {
                const order = await this.cinerino.order.findByConfirmationNumber({
                    confirmationNumber, customer
                });

                return new inquiry.InquirySuccess({ order });
            } catch (error) {
                return new inquiry.InquiryFail({ error: error });
            }
        })
    );

    /**
     * getPurchaseHistory
     */
    @Effect()
    public getPurchaseHistory = this.actions.pipe(
        ofType<inquiry.GetPurchaseHistory>(inquiry.ActionTypes.GetPurchaseHistory),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = { ...payload.params, personId: 'me' };
                await this.cinerino.getServices();
                const searchOrdersResult = await this.cinerino.person.searchOrders(params);
                const orders = searchOrdersResult.data;
                return new inquiry.GetPurchaseHistorySuccess({ result: orders });
            } catch (error) {
                return new inquiry.GetPurchaseHistoryFail({ error: error });
            }
        })
    );

    /**
     * orderAuthorize
     */
    @Effect()
    public orderAuthorize = this.actions.pipe(
        ofType<inquiry.OrderAuthorize>(inquiry.ActionTypes.OrderAuthorize),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = { ...payload.params, personId: 'me' };
                await this.cinerino.getServices();
                const order = await this.cinerino.order.authorizeOwnershipInfos(params);
                return new inquiry.OrderAuthorizeSuccess({ order });
            } catch (error) {
                return new inquiry.OrderAuthorizeFail({ error: error });
            }
        })
    );
}
