import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';
import { Models } from '../..';

const LABEL = '[User]';

export const remove = createAction(
    `${LABEL} remove`,
);

export const initialize = createAction(
    `${LABEL} initialize`,
    props<{ login: boolean }>()
);

export const updateLanguage = createAction(
    `${LABEL} updateLanguage`,
    props<{ language: string }>()
);

export const getProfile = createAction(
    `${LABEL} getProfile`,
);

export const getProfileSuccess = createAction(
    `${LABEL} getProfileSuccess`,
    props<{ profile: factory.person.IProfile; }>()
);

export const getProfileFail = createAction(
    `${LABEL} getProfileFail`,
    props<{ error: Error }>()
);

export const getAccount = createAction(
    `${LABEL} getAccount`,
);

export const getAccountSuccess = createAction(
    `${LABEL} getAccountSuccess`,
    props<{
        accounts: factory.ownershipInfo.IOwnershipInfo<factory.ownershipInfo.IGoodWithDetail>[];
    }>()
);

export const getAccountFail = createAction(
    `${LABEL} getAccountFail`,
    props<{ error: Error }>()
);

export const openAccount = createAction(
    `${LABEL} openAccount`,
    props<{
        name: string;
        accountType: factory.accountType;
    }>()
);

export const openAccountSuccess = createAction(
    `${LABEL} openAccountSuccess`,
    // props<{}>()
);

export const openAccountFail = createAction(
    `${LABEL} openAccountFail`,
    props<{ error: Error }>()
);

export const closeAccount = createAction(
    `${LABEL} closeAccount`,
    props<{
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>;
    }>()
);

export const closeAccountSuccess = createAction(
    `${LABEL} closeAccountSuccess`,
);

export const closeAccountFail = createAction(
    `${LABEL} closeAccountFail`,
    props<{ error: Error }>()
);

export const updateProfile = createAction(
    `${LABEL} updateProfile`,
    props<{
        profile: factory.person.IProfile
    }>()
);

export const updateProfileSuccess = createAction(
    `${LABEL} updateProfileSuccess`,
    props<{
        profile: factory.person.IProfile
    }>()
);

export const updateProfileFail = createAction(
    `${LABEL} updateProfileFail`,
    props<{ error: Error }>()
);

export const updateBaseSetting = createAction(
    `${LABEL} updateBaseSetting`,
    props<{
        pos?: factory.chevre.place.movieTheater.IPOS;
        theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        printer?: Models.Common.Printer.IPrinter;
    }>()
);

export const getCreditCards = createAction(
    `${LABEL} getCreditCards`,
);

export const getCreditCardsSuccess = createAction(
    `${LABEL} getCreditCardsSuccess`,
    props<{ creditCards: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard[] }>()
);

export const getCreditCardsFail = createAction(
    `${LABEL} getCreditCardsFail`,
    props<{ error: Error }>()
);

export const addCreditCard = createAction(
    `${LABEL} addCreditCard`,
    props<{
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        },
        seller: factory.chevre.seller.ISeller;
    }>()
);

export const addCreditCardSuccess = createAction(
    `${LABEL} addCreditCardSuccess`,
    props<{ creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard }>()
);

export const addCreditCardFail = createAction(
    `${LABEL} addCreditCardFail`,
    props<{ error: Error }>()
);

export const removeCreditCard = createAction(
    `${LABEL} removeCreditCard`,
    props<{
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
    }>()
);

export const removeCreditCardSuccess = createAction(
    `${LABEL} removeCreditCardSuccess`,
    props<{
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
    }>()
);

export const removeCreditCardFail = createAction(
    `${LABEL} removeCreditCardFail`,
    props<{ error: Error }>()
);

export const chargeAccount = createAction(
    `${LABEL} chargeAccount`,
    props<{
        seller: factory.chevre.seller.ISeller;
        profile: factory.person.IProfile;
        amount: number;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>;
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember;
    }>()
);

export const chargeAccountSuccess = createAction(
    `${LABEL} chargeAccountSuccess`,
);

export const chargeAccountFail = createAction(
    `${LABEL} chargeAccountFail`,
    props<{ error: Error }>()
);

export const transferAccount = createAction(
    `${LABEL} transferAccount`,
    props<{
        seller: factory.chevre.seller.ISeller;
        profile: factory.person.IProfile;
        account: factory.ownershipInfo.IOwnershipInfo<factory.pecorino.account.IAccount>;
        amount: number;
        description: string;
        accountNumber: string;
    }>()
);

export const transferAccountSuccess = createAction(
    `${LABEL} transferAccountSuccess`,
);

export const transferAccountFail = createAction(
    `${LABEL} transferAccountFail`,
    props<{ error: Error }>()
);

export const setVersion = createAction(
    `${LABEL} setVersion`,
    props<{ version: string }>()
);
