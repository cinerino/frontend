import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { Functions } from '../..';
import { CinerinoService } from '../../services';
import { userAction } from '../actions';

/**
 * User Effects
 */
@Injectable()
export class UserEffects {
    constructor(private actions: Actions, private cinerino: CinerinoService) {}

    /**
     * GetProfile
     */
    @Effect()
    public getProfile = this.actions.pipe(
        ofType(userAction.getProfile),
        map((action) => action),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                // プロフィール
                const id = 'me';
                const profile = await this.cinerino.person.getProfile({ id });
                return userAction.getProfileSuccess({ profile });
            } catch (error) {
                return userAction.getProfileFail({ error: error });
            }
        })
    );

    /**
     * GetAccount
     */
    @Effect()
    public getAccount = this.actions.pipe(
        ofType(userAction.getAccount),
        map((action) => action),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                const searchResult = await this.cinerino.ownershipInfo.search({
                    typeOfGood: {
                        typeOf: 'Account',
                    },
                });
                return userAction.getAccountSuccess({
                    accounts: searchResult.data,
                });
            } catch (error) {
                return userAction.getAccountFail({ error: error });
            }
        })
    );

    /**
     * OpenAccount
     */
    @Effect()
    public openAccount = this.actions.pipe(
        ofType(userAction.openAccount),
        map((action) => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                await this.cinerino.ownershipInfo.openAccount({
                    name: payload.name,
                    accountType: payload.accountType,
                });
                return userAction.openAccountSuccess();
            } catch (error) {
                return userAction.openAccountFail({ error: error });
            }
        })
    );

    /**
     * CloseAccount
     */
    @Effect()
    public closeAccount = this.actions.pipe(
        ofType(userAction.closeAccount),
        map((action) => action),
        mergeMap(async (payload) => {
            try {
                const account = payload.account;
                await this.cinerino.getServices();
                await this.cinerino.ownershipInfo.closeAccount({
                    accountNumber: account.typeOfGood.accountNumber,
                });
                return userAction.closeAccountSuccess();
            } catch (error) {
                return userAction.closeAccountFail({ error: error });
            }
        })
    );

    /**
     * UpdateProfile
     */
    @Effect()
    public UpdateProfile = this.actions.pipe(
        ofType(userAction.updateProfile),
        map((action) => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                await this.cinerino.person.updateProfile(payload.profile);
                const profile = await this.cinerino.person.getProfile({});
                return userAction.updateProfileSuccess({ profile });
            } catch (error) {
                return userAction.updateProfileFail({ error: error });
            }
        })
    );

    /**
     * GetCreditCards
     */
    @Effect()
    public getreditCard = this.actions.pipe(
        ofType(userAction.getCreditCards),
        map((action) => action),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                const creditCards =
                    await this.cinerino.ownershipInfo.searchCreditCards({});
                return userAction.getCreditCardsSuccess({ creditCards });
            } catch (error) {
                return userAction.getCreditCardsFail({ error: error });
            }
        })
    );

    /**
     * AddCreditCard
     */
    @Effect()
    public addCreditCard = this.actions.pipe(
        ofType(userAction.addCreditCard),
        map((action) => action),
        mergeMap(async () => {
            try {
                await this.cinerino.getServices();
                const creditCardToken =
                    // await Functions.Creditcard.createCreditCardTokenObject({
                    //     creditCard: payload.creditCard,
                    //     providerCredentials: payload.providerCredentials,
                    // });
                    {
                        token: 'XXX',
                        maskedCardNo: 'XXX',
                    };
                const creditCard =
                    await this.cinerino.ownershipInfo.addCreditCard({
                        creditCard: creditCardToken,
                    });
                return userAction.addCreditCardSuccess({ creditCard });
            } catch (error) {
                return userAction.addCreditCardFail({ error: error });
            }
        })
    );

    /**
     * RemoveCreditCard
     */
    @Effect()
    public removeCreditCard = this.actions.pipe(
        ofType(userAction.removeCreditCard),
        map((action) => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const creditCard = payload.creditCard;
                const cardSeq = creditCard.cardSeq;
                await this.cinerino.ownershipInfo.deleteCreditCard({ cardSeq });
                return userAction.removeCreditCardSuccess({ creditCard });
            } catch (error) {
                return userAction.removeCreditCardFail({ error: error });
            }
        })
    );

    /**
     * chargeAccount
     */
    @Effect()
    public chargeAccount = this.actions.pipe(
        ofType(userAction.chargeAccount),
        map((action) => action),
        mergeMap(async (payload) => {
            try {
                const seller = payload.seller;
                if (seller.id === undefined) {
                    throw new Error('seller.id undefined');
                }
                const userAgent =
                    navigator && navigator.userAgent !== undefined
                        ? navigator.userAgent
                        : '';
                await this.cinerino.getServices();
                const transaction =
                    await this.cinerino.transaction.placeOrder.start({
                        agent: {
                            identifier: [
                                { name: 'userAgent', value: userAgent },
                            ],
                        },
                        seller: { typeOf: seller.typeOf, id: seller.id },
                        expires: moment().add(1, 'minutes').toDate(),
                    });
                await this.cinerino.transaction.placeOrder.setProfile({
                    id: transaction.id,
                    agent: {
                        ...payload.profile,
                        ...{
                            name: `${payload.profile.givenName} ${payload.profile.familyName}`,
                        },
                    },
                });
                await this.cinerino.offer.authorizeMonetaryAmount({
                    object: {
                        project: {
                            typeOf: factory.chevre.organizationType.Project,
                            id: payload.seller.project.id,
                        },
                        typeOf: factory.chevre.offerType.Offer,
                        itemOffered: {
                            typeOf: 'MonetaryAmount',
                            value: payload.amount,
                            currency: 'Coin',
                        },
                        priceCurrency: factory.priceCurrency.JPY,
                        seller,
                        toLocation: {
                            typeOf: 'Account',
                            identifier: payload.account.identifier,
                        },
                    },
                    purpose: { typeOf: transaction.typeOf, id: transaction.id },
                });

                await this.cinerino.payment.authorizeCreditCard({
                    object: {
                        typeOf: factory.action.authorize.paymentMethod.any
                            .ResultType.Payment,
                        amount: payload.amount,
                        method: '1',
                        creditCard: payload.creditCard,
                        paymentMethod: 'CreditCard',
                    },
                    purpose: { typeOf: transaction.typeOf, id: transaction.id },
                });

                await this.cinerino.transaction.placeOrder.confirm({
                    id: transaction.id,
                });
                await Functions.Util.sleep(3000);
                return userAction.chargeAccountSuccess();
            } catch (error) {
                return userAction.chargeAccountFail({ error: error });
            }
        })
    );
}
