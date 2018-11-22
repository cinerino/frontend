import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { formatTelephone } from '../../functions';
import { CinerinoService } from '../../services/cinerino.service';
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
}
