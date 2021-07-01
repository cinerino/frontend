import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';
import { Functions, Models } from '../..';

const LABEL = '[Purchase]';

export const remove = createAction(`${LABEL} Remove`);

export const unsettledDelete = createAction(`${LABEL} unsettledDelete`);

export const selectScheduleDate = createAction(
    `${LABEL} selectScheduleDate`,
    props<{ scheduleDate: string }>()
);

export const setSeller = createAction(
    `${LABEL} setSeller`,
    props<{
        seller: factory.chevre.seller.ISeller;
    }>()
);

export const selectTheater = createAction(
    `${LABEL} selectTheater`,
    props<{
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    }>()
);

export const setScreeningEvent = createAction(
    `${LABEL} setScreeningEvent`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    }>()
);

export const setTransaction = createAction(
    `${LABEL} setTransaction`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
    }>()
);

export const cancelTransaction = createAction(`${LABEL} cancelTransaction`);

export const setScreeningRoom = createAction(
    `${LABEL} setScreeningRoom`,
    props<{ screeningRoom: factory.chevre.place.screeningRoom.IPlace }>()
);

export const selectSeats = createAction(
    `${LABEL} selectSeats`,
    props<{ seats: Models.Purchase.Reservation.IReservationSeat[] }>()
);

export const cancelSeats = createAction(
    `${LABEL} cancelSeats`,
    props<{ seats: Models.Purchase.Reservation.IReservationSeat[] }>()
);

export const setTicketOffers = createAction(
    `${LABEL} setTicketOffers`,
    props<{
        ticketOffers: factory.chevre.event.screeningEvent.ITicketOffer[];
    }>()
);

export const selectTickets = createAction(
    `${LABEL} selectTickets`,
    props<{ reservations: Models.Purchase.Reservation.IReservation[] }>()
);

export const setAuthorizeSeatReservation = createAction(
    `${LABEL} setAuthorizeSeatReservation`,
    props<{
        addAuthorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
        removeAuthorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }>()
);

export const voidSeatReservation = createAction(
    `${LABEL} voidSeatReservation`,
    props<{
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    }>()
);

export const registerCreditCard = createAction(
    `${LABEL} registerCreditCard`,
    props<{
        creditCard:
            | factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
    }>()
);

export const removeCreditCard = createAction(`${LABEL} removeCreditCard`);

export const setProfile = createAction(
    `${LABEL} setProfile`,
    props<{
        profile: factory.person.IProfile;
    }>()
);

export const setAuthorizeCreditCard = createAction(
    `${LABEL} setAuthorizeCreditCard`,
    props<{
        authorizeResult: factory.action.authorize.paymentMethod.any.IAction;
    }>()
);

export const setAuthorizeMovieTicket = createAction(
    `${LABEL} setAuthorizeMovieTicket`,
    props<{
        authorizeResults: factory.action.authorize.paymentMethod.any.IAction[];
    }>()
);

export const setCheckMovieTicket = createAction(
    `${LABEL} setCheckMovieTicket`,
    props<{
        checkMovieTicket: factory.action.check.paymentMethod.movieTicket.IAction;
    }>()
);

export const setOrder = createAction(
    `${LABEL} setOrder`,
    props<{ order: factory.order.IOrder }>()
);

export const setCreditCardTokenObject = createAction(
    `${LABEL} setCreditCardTokenObject`,
    props<{
        creditCardToken:
            | Functions.Creditcard.IGmoTokenObject
            | Functions.Creditcard.ISonyTokenObject;
    }>()
);

export const setExternalPurchaseData = createAction(
    `${LABEL} setExternalPurchaseData`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        seller: factory.chevre.seller.ISeller;
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    }>()
);

export const setProduct = createAction(
    `${LABEL} setProduct`,
    props<{
        product: factory.product.IProduct;
    }>()
);

export const setTicketOffer = createAction(
    `${LABEL} setTicketOffer`,
    props<{
        ticketOffer: factory.event.screeningEvent.ITicketOffer;
    }>()
);

export const setAuthorizeProduct = createAction(
    `${LABEL} setAuthorizeProduct`,
    props<{
        authorizeResult: factory.action.authorize.offer.product.IAction;
    }>()
);

export const setCheckMembership = createAction(
    `${LABEL} setCheckMembership`,
    props<{
        checkMembership: { identifier: string; accessCode: string };
    }>()
);
