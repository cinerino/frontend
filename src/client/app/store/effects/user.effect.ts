import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { LibphonenumberFormatPipe } from '../../pipes/libphonenumber-format.pipe';
import { CinerinoService } from '../../services';
import * as user from '../actions/user.action';

type accountType = factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount<any>>;

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
     * InitializeProfile
     */
    @Effect()
    public initializeProfile = this.actions.pipe(
        ofType<user.InitializeProfile>(user.ActionTypes.InitializeProfile),
        map(action => action.payload),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                // プロフィール
                const personId = 'me';
                const profile = await this.cinerino.person.getProfile({ personId });
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                return new user.InitializeProfileSuccess({ profile });
            } catch (error) {
                return new user.InitializeProfileFail({ error: error });
            }
        })
    );

    /**
     * InitializeCoinAccount
     */
    @Effect()
    public initializeCoinAccount = this.actions.pipe(
        ofType<user.InitializeCoinAccount>(user.ActionTypes.InitializeCoinAccount),
        map(action => action.payload),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                // コイン口座
                const personId = 'me';
                const searchAccountsResult = await this.cinerino.ownershipInfo.search<factory.ownershipInfo.AccountGoodType>({
                    personId,
                    typeOfGood: {
                        typeOf: factory.ownershipInfo.AccountGoodType.Account,
                        accountType: factory.accountType.Coin
                    }
                });
                const accounts = searchAccountsResult.data
                    .filter((a) => a.typeOfGood.status === factory.pecorino.accountStatusType.Opened);
                let account: accountType;
                if (accounts.length === 0) {
                    account = await this.cinerino.ownershipInfo.openAccount({
                        personId,
                        name: this.cinerino.userName,
                        accountType: factory.accountType.Coin
                    });
                    console.log('account opened', account.typeOfGood.accountNumber);
                } else {
                    account = accounts[0];
                }
                const coin = { account };
                return new user.InitializeCoinAccountSuccess({ coin });
            } catch (error) {
                return new user.InitializeCoinAccountFail({ error: error });
            }
        })
    );

    /**
     * UpdateProfile
     */
    @Effect()
    public UpdateProfile = this.actions.pipe(
        ofType<user.UpdateProfile>(user.ActionTypes.UpdateProfile),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const personId = 'me';
                const profile = payload.profile;
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone, undefined, 'E.164');
                await this.cinerino.person.updateProfile({ ...profile, personId });
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                return new user.UpdateProfileSuccess({ profile });
            } catch (error) {
                return new user.UpdateProfileFail({ error: error });
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
