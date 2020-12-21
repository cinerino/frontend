import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';
import { Functions, Models } from '../..';

const LABEL = '[Purchase]';

export const remove = createAction(
    `${LABEL} Remove`,
);

export const unsettledDelete = createAction(
    `${LABEL} unsettledDelete`,
);

export const selectScheduleDate = createAction(
    `${LABEL} selectScheduleDate`,
    props<{ scheduleDate: string }>()
);

export const getSeller = createAction(
    `${LABEL} getSeller`,
    props<{ id: string; }>()
);

export const getSellerSuccess = createAction(
    `${LABEL} getSellerSuccess`,
    props<{
        seller: factory.chevre.seller.ISeller
    }>()
);

export const getSellerFail = createAction(
    `${LABEL} getSellerFail`,
    props<{ error: Error }>()
);

export const selectTheater = createAction(
    `${LABEL} selectTheater`,
    props<{ theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom }>()
);

export const getPreScheduleDates = createAction(
    `${LABEL} getPreScheduleDates`,
    props<{
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        superEvent: {
            ids?: string[];
            locationBranchCodes?: string[];
            workPerformedIdentifiers?: string[];
        };
    }>()
);

export const getPreScheduleDatesSuccess = createAction(
    `${LABEL} getPreScheduleDatesSuccess`,
    props<{
        sheduleDates: string[]
    }>()
);

export const getPreScheduleDatesFail = createAction(
    `${LABEL} getSellerFail`,
    props<{ error: Error }>()
);

export const getScreeningEvent = createAction(
    `${LABEL} getScreeningEvent`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent
    }>()
);

export const getScreeningEventSuccess = createAction(
    `${LABEL} getScreeningEventSuccess`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent
    }>()
);

export const getScreeningEventFail = createAction(
    `${LABEL} getScreeningEventFail`,
    props<{ error: Error }>()
);

export const startTransaction = createAction(
    `${LABEL} startTransaction`,
    props<{
        expires: Date;
        agent?: { identifier?: factory.person.IIdentifier; };
        seller: { typeOf: factory.chevre.organizationType; id: string; };
        object: {
            passport?: { token: factory.waiter.passport.IEncodedPassport; };
        };
    }>()
);

export const startTransactionSuccess = createAction(
    `${LABEL} startTransactionSuccess`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction
    }>()
);

export const startTransactionFail = createAction(
    `${LABEL} startTransactionFail`,
    props<{ error: Error }>()
);

export const cancelTransaction = createAction(
    `${LABEL} cancelTransaction`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction
    }>()
);

export const cancelTransactionSuccess = createAction(
    `${LABEL} cancelTransactionSuccess`,
);

export const cancelTransactionFail = createAction(
    `${LABEL} cancelTransactionFail`,
    props<{ error: Error }>()
);

export const getScreen = createAction(
    `${LABEL} getScreen`,
    props<{
        limit?: number;
        page?: number;
        branchCode?: {
            $eq?: string;
        };
        containedInPlace?: {
            branchCode?: {
                $eq?: string;
            };
        };
    }>()
);

export const getScreenSuccess = createAction(
    `${LABEL} getScreenSuccess`,
    props<{ screen: factory.chevre.place.screeningRoom.IPlace; }>()
);

export const getScreenFail = createAction(
    `${LABEL} getScreenFail`,
    props<{ error: Error }>()
);

export const selectSeats = createAction(
    `${LABEL} selectSeats`,
    props<{ seats: Models.Purchase.Reservation.IReservationSeat[] }>()
);

export const cancelSeats = createAction(
    `${LABEL} cancelSeats`,
    props<{ seats: Models.Purchase.Reservation.IReservationSeat[] }>()
);

export const getTicketList = createAction(
    `${LABEL} getTicketList`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        seller: factory.chevre.seller.ISeller;
    }>()
);

export const getTicketListSuccess = createAction(
    `${LABEL} getTicketListSuccess`,
    props<{
        screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[]
    }
    >()
);

export const getTicketListFail = createAction(
    `${LABEL} getTicketListFail`,
    props<{ error: Error }>()
);

export const selectTickets = createAction(
    `${LABEL} selectTickets`,
    props<{ reservations: Models.Purchase.Reservation.IReservation[] }>()
);

export const temporaryReservation = createAction(
    `${LABEL} temporaryReservation`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>;
        reservations: Models.Purchase.Reservation.IReservation[];
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
        additionalTicketText?: string;
    }>()
);

export const temporaryReservationSuccess = createAction(
    `${LABEL} temporaryReservationSuccess`,
    props<{
        addAuthorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>;
        removeAuthorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>;
    }>()
);

export const temporaryReservationFail = createAction(
    `${LABEL} temporaryReservationFail`,
    props<{ error: Error }>()
);

export const cancelTemporaryReservations = createAction(
    `${LABEL} tTemporaryReservation`,
    props<{
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    }>()
);

export const cancelTemporaryReservationsSuccess = createAction(
    `${LABEL} cancelTemporaryReservationsSuccess`,
    props<{
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    }>()
);

export const cancelTemporaryReservationsFail = createAction(
    `${LABEL} cancelTemporaryReservationsFail`,
    props<{ error: Error }>()
);

export const registerCreditCard = createAction(
    `${LABEL} registerCreditCard`,
    props<{
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
    }>()
);

export const removeCreditCard = createAction(
    `${LABEL} removeCreditCard`,
);

export const registerContact = createAction(
    `${LABEL} registerContact`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        profile: factory.person.IProfile;
    }>()
);

export const registerContactSuccess = createAction(
    `${LABEL} registerContactSuccess`,
    props<{ profile: factory.person.IProfile }>()
);

export const registerContactFail = createAction(
    `${LABEL} registerContactFail`,
    props<{ error: Error }>()
);

export const authorizeCreditCard = createAction(
    `${LABEL} authorizeCreditCard`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        authorizeCreditCardPayment?: factory.action.authorize.paymentMethod.any.IAction;
        orderCount: number;
        amount: number;
        method: string;
        creditCard: factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
        | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;
    }>()
);

export const authorizeCreditCardSuccess = createAction(
    `${LABEL} authorizeCreditCardSuccess`,
    props<{
        authorizeCreditCardPayment: factory.action.authorize.paymentMethod.any.IAction
    }>()
);

export const authorizeCreditCardFail = createAction(
    `${LABEL} authorizeCreditCardFail`,
    props<{ error: Error }>()
);

export const authorizeMovieTicket = createAction(
    `${LABEL} authorizeMovieTicket`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.any.IAction[];
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
        pendingMovieTickets: Models.Purchase.MovieTicket.IMovieTicket[];
        seller: factory.chevre.seller.ISeller
    }>()
);

export const authorizeMovieTicketSuccess = createAction(
    `${LABEL} authorizeMovieTicketSuccess`,
    props<{
        authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.any.IAction[]
    }>()
);

export const authorizeMovieTicketFail = createAction(
    `${LABEL} authorizeMovieTicketFail`,
    props<{ error: Error }>()
);

export const checkMovieTicket = createAction(
    `${LABEL} checkMovieTicket`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        movieTickets: {
            typeOf: factory.paymentMethodType;
            identifier: string;
            accessCode: string;
        }[];
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    }>()
);

export const checkMovieTicketSuccess = createAction(
    `${LABEL} checkMovieTicketSuccess`,
    props<{
        checkMovieTicketAction: factory.action.check.paymentMethod.movieTicket.IAction
    }>()
);

export const checkMovieTicketFail = createAction(
    `${LABEL} checkMovieTicketFail`,
    props<{ error: Error }>()
);

export const endTransaction = createAction(
    `${LABEL} endTransaction`,
    props<{
        transaction: factory.transaction.placeOrder.ITransaction;
        seller: factory.chevre.seller.ISeller;
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[];
        language: string;
        linyId?: string;
    }>()
);

export const endTransactionSuccess = createAction(
    `${LABEL} endTransactionSuccess`,
    props<{ order: factory.order.IOrder }>()
);

export const endTransactionFail = createAction(
    `${LABEL} endTransactionFail`,
    props<{ error: Error }>()
);

export const createGmoTokenObject = createAction(
    `${LABEL} createGmoTokenObject`,
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

export const createGmoTokenObjectSuccess = createAction(
    `${LABEL} createGmoTokenObjectSuccess`,
    props<{ gmoTokenObject: Functions.Purchase.IGmoTokenObject; }>()
);

export const createGmoTokenObjectFail = createAction(
    `${LABEL} createGmoTokenObjectFail`,
    props<{ error: Error }>()
);

export const convertExternalToPurchase = createAction(
    `${LABEL} convertExternalToPurchase`,
    props<{ eventId: string; }>()
);

export const convertExternalToPurchaseSuccess = createAction(
    `${LABEL} convertExternalToPurchaseSuccess`,
    props<{
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        seller: factory.chevre.seller.ISeller;
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    }>()
);

export const convertExternalToPurchaseFail = createAction(
    `${LABEL} convertExternalToPurchaseFail`,
    props<{ error: Error }>()
);
