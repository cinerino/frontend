import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { LibphonenumberFormatPipe } from '../../pipes/libphonenumber-format.pipe';
import { CinerinoService } from '../../services/cinerino.service';
import * as user from '../actions/user.action';

/**
 * User Effects
 */
@Injectable()
export class UserEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService
    ) { }

    /**
     * Create
     */
    @Effect()
    public create = this.actions.pipe(
        ofType<user.Create>(user.ActionTypes.Create),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const personId = 'me';
                const profile = await this.cinerino.person.getProfile({ personId });
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                return new user.CreateSuccess({ profile });
            } catch (error) {
                return new user.CreateFail({ error: error });
            }
        })
    );

    /**
     * UpdateCustomer
     */
    @Effect()
    public UpdateCustomer = this.actions.pipe(
        ofType<user.UpdateCustomer>(user.ActionTypes.UpdateCustomer),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const personId = 'me';
                const profile = payload.profile;
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone, undefined, 'E.164');
                await this.cinerino.person.updateProfile({ ...profile, personId });
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                return new user.UpdateCustomerSuccess({ profile });
            } catch (error) {
                return new user.UpdateCustomerFail({ error: error });
            }
        })
    );

    /**
     * UpdatePayment
     */
    @Effect()
    public UpdatePayment = this.actions.pipe(
        ofType<user.UpdatePayment>(user.ActionTypes.UpdatePayment),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                return new user.UpdatePaymentSuccess({});
            } catch (error) {
                return new user.UpdatePaymentFail({ error: error });
            }
        })
    );
}
