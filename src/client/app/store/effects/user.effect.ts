import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { createGmoTokenObject } from '../../functions';
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
                const id = 'me';
                const profile = await this.cinerino.person.getProfile({ id });
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
                const id = 'me';
                const searchAccountsResult = await this.cinerino.ownershipInfo.search<factory.ownershipInfo.AccountGoodType>({
                    id,
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
                        id,
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
                const id = 'me';
                const profile = payload.profile;
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone, undefined, 'E.164');
                await this.cinerino.person.updateProfile({ ...profile, id });
                profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                return new user.UpdateProfileSuccess({ profile });
            } catch (error) {
                return new user.UpdateProfileFail({ error: error });
            }
        })
    );

    /**
     * GetCreditCards
     */
    @Effect()
    public getreditCard = this.actions.pipe(
        ofType<user.GetCreditCards>(user.ActionTypes.GetCreditCards),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const id = 'me';
                const creditCards = await this.cinerino.ownershipInfo.searchCreditCards({ id });
                return new user.GetCreditCardsSuccess({ creditCards });
            } catch (error) {
                return new user.GetCreditCardsFail({ error: error });
            }
        })
    );

    /**
     * AddCreditCard
     */
    @Effect()
    public addCreditCard = this.actions.pipe(
        ofType<user.AddCreditCard>(user.ActionTypes.AddCreditCard),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const gmoTokenObject = await createGmoTokenObject({ creditCard: payload.creditCard, seller: payload.seller });
                const id = 'me';
                const creditCard = await this.cinerino.ownershipInfo.addCreditCard({ id, creditCard: gmoTokenObject });
                return new user.AddCreditCardSuccess({ creditCard });
            } catch (error) {
                return new user.AddCreditCardFail({ error: error });
            }
        })
    );

    /**
     * RemoveCreditCard
     */
    @Effect()
    public removeCreditCard = this.actions.pipe(
        ofType<user.RemoveCreditCard>(user.ActionTypes.RemoveCreditCard),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const id = 'me';
                const creditCard = payload.creditCard;
                const cardSeq = creditCard.cardSeq;
                await this.cinerino.ownershipInfo.deleteCreditCard({ id, cardSeq });
                return new user.RemoveCreditCardSuccess({ creditCard });
            } catch (error) {
                return new user.RemoveCreditCardFail({ error: error });
            }
        })
    );

    /**
     * ChargeCoin
     */
    @Effect()
    public chargeCoin = this.actions.pipe(
        ofType<user.ChargeCoin>(user.ActionTypes.ChargeCoin),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                // const id = 'me';
                return new user.ChargeCoinSuccess({ });
            } catch (error) {
                return new user.ChargeCoinFail({ error: error });
            }
        })
    );
}
