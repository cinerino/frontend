import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { createGmoTokenObject, formatTelephone, sleep } from '../../functions';
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
                if (payload.profile.telephone !== undefined) {
                    payload.profile.telephone = formatTelephone(payload.profile.telephone, 'E.164');
                }
                await this.cinerino.person.updateProfile(payload.profile);
                const id = 'me';
                const profile = await this.cinerino.person.getProfile({ id });
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
        mergeMap(async () => {
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
            // console.log(payload);
            try {
                const userAgent = (navigator && navigator.userAgent !== undefined) ? navigator.userAgent : '';
                await this.cinerino.getServices();
                const transaction = await this.cinerino.transaction.placeOrder.start({
                    agent: {
                        identifier: [{ name: 'userAgent', value: userAgent }],
                    },
                    seller: { typeOf: payload.seller.typeOf, id: payload.seller.id },
                    expires: moment().add(1, 'minutes').toDate()
                });
                await this.cinerino.transaction.placeOrder.setProfile({
                    id: transaction.id,
                    agent: {
                        ...payload.profile,
                        ...{ name: `${payload.profile.givenName} ${payload.profile.familyName}` }
                    }
                });
                await this.cinerino.offer.authorizeMonetaryAmount({
                    object: {
                        project: { typeOf: factory.organizationType.Project, id: payload.seller.project.id },
                        typeOf: 'Offer',
                        itemOffered: {
                            typeOf: 'MonetaryAmount',
                            value: payload.amount,
                            currency: factory.accountType.Coin
                        },
                        priceCurrency: factory.priceCurrency.JPY,
                        seller: { typeOf: payload.seller.typeOf, name: payload.seller.name.ja },
                        toLocation: {
                            typeOf: factory.pecorino.account.TypeOf.Account,
                            accountType: factory.accountType.Coin,
                            accountNumber: payload.account.typeOfGood.accountNumber
                        }
                    },
                    purpose: { typeOf: transaction.typeOf, id: transaction.id }
                });

                await this.cinerino.payment.authorizeCreditCard({
                    object: {
                        typeOf: factory.paymentMethodType.CreditCard,
                        amount: payload.amount,
                        method: <any>'1',
                        creditCard: payload.creditCard
                    },
                    purpose: { typeOf: transaction.typeOf, id: transaction.id }
                });

                await this.cinerino.transaction.placeOrder.confirm({
                    id: transaction.id
                });
                await sleep();
                return new userAction.ChargeAccountSuccess({});
            } catch (error) {
                return new userAction.ChargeAccountFail({ error: error });
            }
        })
    );

    /**
     * transferAccount
     */
    @Effect()
    public tansferAccount = this.actions.pipe(
        ofType<userAction.TransferAccount>(userAction.ActionTypes.TransferAccount),
        map(action => action.payload),
        mergeMap(async (payload) => {
            console.log(payload);
            try {
                await this.cinerino.getServices();
                const transaction =
                    await this.cinerino.transaction.moneyTransfer.start<factory.accountType.Coin, factory.pecorino.account.TypeOf.Account>({
                        project: { typeOf: factory.organizationType.Project, id: payload.seller.project.id },
                        expires: moment().add(1, 'minutes').toDate(),
                        agent: {
                            typeOf: factory.personType.Person,
                            id: this.cinerino.auth.options.clientId,
                        },
                        recipient: {
                            typeOf: factory.personType.Person,
                            id: '',
                            url: ''
                        },
                        seller: { typeOf: payload.seller.typeOf, id: payload.seller.id },
                        object: {
                            amount: payload.amount,
                            authorizeActions: [],
                            description: payload.description,
                            fromLocation: {
                                typeOf: factory.pecorino.account.TypeOf.Account,
                                accountType: payload.account.typeOfGood.accountType,
                                accountNumber: payload.account.typeOfGood.accountNumber
                            },
                            toLocation: {
                                typeOf: factory.pecorino.account.TypeOf.Account,
                                accountType: payload.account.typeOfGood.accountType,
                                accountNumber: payload.accountNumber
                            }
                        }
                    });
                await this.cinerino.transaction.moneyTransfer.setProfile({
                    id: transaction.id,
                    agent: {
                        ...payload.profile,
                        name: `${payload.profile.givenName} ${payload.profile.familyName}`
                    }
                });

                // 取引確定
                await this.cinerino.transaction.moneyTransfer.confirm({
                    id: transaction.id
                });
                await sleep();
                return new userAction.TransferAccountSuccess({});
            } catch (error) {
                return new userAction.TransferAccountFail({ error: error });
            }
        })
    );
}
