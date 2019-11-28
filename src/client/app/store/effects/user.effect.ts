import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { createGmoTokenObject } from '../../functions';
import { LibphonenumberFormatPipe } from '../../modules/shared/pipes/libphonenumber-format.pipe';
import { CinerinoService } from '../../services';
import { userAction } from '../actions';

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
     * GetProfile
     */
    @Effect()
    public getProfile = this.actions.pipe(
        ofType<userAction.GetProfile>(userAction.ActionTypes.GetProfile),
        map(action => action.payload),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                // プロフィール
                const id = 'me';
                const profile = await this.cinerino.person.getProfile({ id });
                if (profile.telephone !== undefined) {
                    profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                }
                return new userAction.GetProfileSuccess({ profile });
            } catch (error) {
                return new userAction.GetProfileFail({ error: error });
            }
        })
    );

    /**
     * GetAccount
     */
    @Effect()
    public getAccount = this.actions.pipe(
        ofType<userAction.GetAccount>(userAction.ActionTypes.GetAccount),
        map(action => action.payload),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                const searchCoinAccountsResult = await this.cinerino.ownershipInfo.search<factory.ownershipInfo.AccountGoodType>({
                    typeOfGood: {
                        typeOf: factory.ownershipInfo.AccountGoodType.Account,
                        accountType: factory.accountType.Coin
                    }
                });
                const searchPointAccountsResult = await this.cinerino.ownershipInfo.search<factory.ownershipInfo.AccountGoodType>({
                    typeOfGood: {
                        typeOf: factory.ownershipInfo.AccountGoodType.Account,
                        accountType: factory.accountType.Point
                    }
                });
                const searchAccounts = [...searchCoinAccountsResult.data, ...searchPointAccountsResult.data];
                const accounts = searchAccounts
                    .filter((a) => a.typeOfGood.status === factory.pecorino.accountStatusType.Opened);
                return new userAction.GetAccountSuccess({ accounts });
            } catch (error) {
                return new userAction.GetAccountFail({ error: error });
            }
        })
    );

    /**
     * OpenAccount
     */
    @Effect()
    public openAccount = this.actions.pipe(
        ofType<userAction.OpenAccount>(userAction.ActionTypes.OpenAccount),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const account = await this.cinerino.ownershipInfo.openAccount({
                    name: payload.name,
                    accountType: payload.accountType
                });
                return new userAction.OpenAccountSuccess({ account });
            } catch (error) {
                return new userAction.OpenAccountFail({ error: error });
            }
        })
    );

    /**
     * CloseAccount
     */
    @Effect()
    public closeAccount = this.actions.pipe(
        ofType<userAction.CloseAccount>(userAction.ActionTypes.CloseAccount),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const account = payload.account;
                await this.cinerino.getServices();
                await this.cinerino.ownershipInfo.closeAccount({
                    accountNumber: account.typeOfGood.accountNumber,
                    accountType: account.typeOfGood.accountType
                });
                return new userAction.CloseAccountSuccess();
            } catch (error) {
                return new userAction.CloseAccountFail({ error: error });
            }
        })
    );

    /**
     * UpdateProfile
     */
    @Effect()
    public UpdateProfile = this.actions.pipe(
        ofType<userAction.UpdateProfile>(userAction.ActionTypes.UpdateProfile),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const profile = payload.profile;
                if (profile.telephone !== undefined) {
                    profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone, undefined, 'E.164');
                }
                await this.cinerino.person.updateProfile({ ...profile });
                if (profile.telephone !== undefined) {
                    profile.telephone = new LibphonenumberFormatPipe().transform(profile.telephone);
                }
                return new userAction.UpdateProfileSuccess({ profile });
            } catch (error) {
                return new userAction.UpdateProfileFail({ error: error });
            }
        })
    );

    /**
     * GetCreditCards
     */
    @Effect()
    public getreditCard = this.actions.pipe(
        ofType<userAction.GetCreditCards>(userAction.ActionTypes.GetCreditCards),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const creditCards = await this.cinerino.ownershipInfo.searchCreditCards({});
                return new userAction.GetCreditCardsSuccess({ creditCards });
            } catch (error) {
                return new userAction.GetCreditCardsFail({ error: error });
            }
        })
    );

    /**
     * AddCreditCard
     */
    @Effect()
    public addCreditCard = this.actions.pipe(
        ofType<userAction.AddCreditCard>(userAction.ActionTypes.AddCreditCard),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const gmoTokenObject = await createGmoTokenObject({ creditCard: payload.creditCard, seller: payload.seller });
                const creditCard = await this.cinerino.ownershipInfo.addCreditCard({ creditCard: gmoTokenObject });
                return new userAction.AddCreditCardSuccess({ creditCard });
            } catch (error) {
                return new userAction.AddCreditCardFail({ error: error });
            }
        })
    );

    /**
     * RemoveCreditCard
     */
    @Effect()
    public removeCreditCard = this.actions.pipe(
        ofType<userAction.RemoveCreditCard>(userAction.ActionTypes.RemoveCreditCard),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const creditCard = payload.creditCard;
                const cardSeq = creditCard.cardSeq;
                await this.cinerino.ownershipInfo.deleteCreditCard({ cardSeq });
                return new userAction.RemoveCreditCardSuccess({ creditCard });
            } catch (error) {
                return new userAction.RemoveCreditCardFail({ error: error });
            }
        })
    );

    /**
     * chargeAccount
     */
    @Effect()
    public chargeAccount = this.actions.pipe(
        ofType<userAction.ChargeAccount>(userAction.ActionTypes.ChargeAccount),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                throw new Error('Unimplemented!!');
                // const id = 'me';
                // return new userAction.ChargeAccountSuccess({ });
            } catch (error) {
                return new userAction.ChargeAccountFail({ error: error });
            }
        })
    );
}
