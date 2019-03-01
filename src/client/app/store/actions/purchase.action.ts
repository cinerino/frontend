import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { IGmoTokenObject } from '../../functions';
import { IMovieTicket, IReservationSeat, IReservationTicket, IScreen, Reservation } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Purchase] Delete',
    UnsettledDelete = '[Purchase] Unsettled Delete',
    SelectSeller = '[Purchase] Select Seller',
    SelectScheduleDate = '[Purchase] Select Schedule Date',
    GetPreScheduleDates = '[Purchase] Get Pre Schedule',
    GetPreScheduleDatesSuccess = '[Purchase] Get Pre Schedule Success',
    GetPreScheduleDatesFail = '[Purchase] Get Pre Schedule Fail',
    SelectSchedule = '[Purchase] Select Schedule',
    StartTransaction = '[Purchase] Start Transaction',
    StartTransactionSuccess = '[Purchase] Start Transaction Success',
    StartTransactionFail = '[Purchase] Start Transaction Fail',
    GetScreen = '[Purchase] Get Screen',
    GetScreenSuccess = '[Purchase] Get Screen Success',
    GetScreenFail = '[Purchase] Get Screen Fail',
    SelectSeats = '[Purchase] Select Seats',
    CancelSeats = '[Purchase] Cancel Seats',
    GetTicketList = '[Purchase] Get Ticket List',
    GetTicketListSuccess = '[Purchase] Get Ticket List Success',
    GetTicketListFail = '[Purchase] Get Ticket List Fail',
    SelectTickets = '[Purchase] Select Tickets',
    TemporaryReservation = '[Purchase] Temporary Reservation',
    TemporaryReservationSuccess = '[Purchase] Temporary Reservation Success',
    TemporaryReservationFail = '[Purchase] Temporary Reservation Fail',
    TemporaryReservationFreeSeat = '[Purchase] Temporary Reservation Free Seat',
    TemporaryReservationFreeSeatSuccess = '[Purchase] Temporary Reservation Free Seat Success',
    TemporaryReservationFreeSeatFail = '[Purchase] Temporary Reservation Free Seat Fail',
    CancelTemporaryReservations = '[Purchase] Cancel Temporary Reservation',
    CancelTemporaryReservationsSuccess = '[Purchase] Cancel Temporary Reservation Success',
    CancelTemporaryReservationsFail = '[Purchase] Cancel Temporary Reservation Fail',
    RegisterContact = '[Purchase] Register Contact',
    RegisterContactSuccess = '[Purchase] Register Contact Success',
    RegisterContactFail = '[Purchase] Register Contact Fail',
    AuthorizeCreditCard = '[Purchase] Authorize Credit Card',
    AuthorizeCreditCardSuccess = '[Purchase] Authorize Credit Card Success',
    AuthorizeCreditCardFail = '[Purchase] Authorize Credit Card Fail',
    AuthorizeMovieTicket = '[Purchase] Authorize Movie Ticket',
    AuthorizeMovieTicketSuccess = '[Purchase] Authorize Movie Ticket Success',
    AuthorizeMovieTicketFail = '[Purchase] Authorize Movie Ticket Fail',
    CheckMovieTicket = '[Purchase] Check Movie Ticket',
    CheckMovieTicketSuccess = '[Purchase] Check Movie Ticket Success',
    CheckMovieTicketFail = '[Purchase] Check Movie Ticket Fail',
    Reserve = '[Purchase] Reserve',
    ReserveSuccess = '[Purchase] Reserve Success',
    ReserveFail = '[Purchase] Reserve Fail',
    CreateGmoTokenObject = '[Purchase] Create Gmo Token Object',
    CreateGmoTokenObjectSuccess = '[Purchase] Create Gmo Token Object Success',
    CreateGmoTokenObjectFail = '[Purchase] Create Gmo Token Object Fail'
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * UnsettledDelete
 */
export class UnsettledDelete implements Action {
    public readonly type = ActionTypes.UnsettledDelete;
    constructor(public payload?: {}) { }
}

/**
 * SelectScheduleDate
 */
export class SelectScheduleDate implements Action {
    public readonly type = ActionTypes.SelectScheduleDate;
    constructor(public payload: { scheduleDate: string }) { }
}

/**
 * SelectSeller
 */
export class SelectSeller implements Action {
    public readonly type = ActionTypes.SelectSeller;
    constructor(public payload: { seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>> }) { }
}

/**
 * GetPreScheduleDates
 */
export class GetPreScheduleDates implements Action {
    public readonly type = ActionTypes.GetPreScheduleDates;
    constructor(public payload: {
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    }) { }
}

/**
 * GetPreScheduleDatesSuccess
 */
export class GetPreScheduleDatesSuccess implements Action {
    public readonly type = ActionTypes.GetPreScheduleDatesSuccess;
    constructor(public payload: {
        sheduleDates: string[]
    }) { }
}

/**
 * GetPreScheduleDatesFail
 */
export class GetPreScheduleDatesFail implements Action {
    public readonly type = ActionTypes.GetPreScheduleDatesFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * SelectSchedule
 */
export class SelectSchedule implements Action {
    public readonly type = ActionTypes.SelectSchedule;
    constructor(public payload: { screeningEvent: factory.chevre.event.screeningEvent.IEvent }) { }
}

/**
 * StartTransaction
 */
export class StartTransaction implements Action {
    public readonly type = ActionTypes.StartTransaction;
    constructor(public payload: {
        params: {
            expires: Date;
            agent?: { identifier?: factory.person.IIdentifier; };
            seller: { typeOf: factory.organizationType; id: string; };
            object: {
                passport?: { token: factory.waiter.passport.IEncodedPassport; };
            };
        }
    }) { }
}

/**
 * StartTransactionSuccess
 */
export class StartTransactionSuccess implements Action {
    public readonly type = ActionTypes.StartTransactionSuccess;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction
    }) { }
}

/**
 * StartTransactionFail
 */
export class StartTransactionFail implements Action {
    public readonly type = ActionTypes.StartTransactionFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * GetScreen
 */
export class GetScreen implements Action {
    public readonly type = ActionTypes.GetScreen;
    constructor(public payload: { screeningEvent: factory.chevre.event.screeningEvent.IEvent }) { }
}

/**
 * GetScreenSuccess
 */
export class GetScreenSuccess implements Action {
    public readonly type = ActionTypes.GetScreenSuccess;
    constructor(public payload: {
        screeningEventOffers: factory.chevre.event.screeningEvent.IScreeningRoomSectionOffer[];
        screenData: IScreen;
    }) { }
}

/**
 * GetScreenFail
 */
export class GetScreenFail implements Action {
    public readonly type = ActionTypes.GetScreenFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * SelectSeats
 */
export class SelectSeats implements Action {
    public readonly type = ActionTypes.SelectSeats;
    constructor(public payload: { seats: IReservationSeat[] }) { }
}

/**
 * CancelSeats
 */
export class CancelSeats implements Action {
    public readonly type = ActionTypes.CancelSeats;
    constructor(public payload: { seats: IReservationSeat[] }) { }
}

/**
 * SelectTickets
 */
export class SelectTickets implements Action {
    public readonly type = ActionTypes.SelectTickets;
    constructor(public payload: { reservations: Reservation[] }) { }
}

/**
 * GetTicketList
 */
export class GetTicketList implements Action {
    public readonly type = ActionTypes.GetTicketList;
    constructor(public payload: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    }) { }
}

/**
 * GetTicketListSuccess
 */
export class GetTicketListSuccess implements Action {
    public readonly type = ActionTypes.GetTicketListSuccess;
    constructor(public payload: { screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[] }) { }
}

/**
 * GetTicketListFail
 */
export class GetTicketListFail implements Action {
    public readonly type = ActionTypes.GetTicketListFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * TemporaryReservation
 */
export class TemporaryReservation implements Action {
    public readonly type = ActionTypes.TemporaryReservation;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
        reservations: Reservation[];
    }) { }
}

/**
 * TemporaryReservationSuccess
 */
export class TemporaryReservationSuccess implements Action {
    public readonly type = ActionTypes.TemporaryReservationSuccess;
    constructor(public payload: {
        addAuthorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
        removeAuthorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }) { }
}

/**
 * TemporaryReservationFail
 */
export class TemporaryReservationFail implements Action {
    public readonly type = ActionTypes.TemporaryReservationFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * TemporaryReservationFreeSeat
 */
export class TemporaryReservationFreeSeat implements Action {
    public readonly type = ActionTypes.TemporaryReservationFreeSeat;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        reservationTickets: IReservationTicket[]
    }) { }
}

/**
 * TemporaryReservationFreeSeatSuccess
 */
export class TemporaryReservationFreeSeatSuccess implements Action {
    public readonly type = ActionTypes.TemporaryReservationFreeSeatSuccess;
    constructor(public payload: {
        addAuthorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }) { }
}

/**
 * TemporaryReservationFreeSeatFail
 */
export class TemporaryReservationFreeSeatFail implements Action {
    public readonly type = ActionTypes.TemporaryReservationFreeSeatFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * CancelTemporaryReservations
 */
export class CancelTemporaryReservations implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservations;
    constructor(public payload: {
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[];
    }) { }
}

/**
 * CancelTemporaryReservationsSuccess
 */
export class CancelTemporaryReservationsSuccess implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservationsSuccess;
    constructor(public payload: {
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[];
    }) { }
}

/**
 * CancelTemporaryReservationsFail
 */
export class CancelTemporaryReservationsFail implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservationsFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * RegisterContact
 */
export class RegisterContact implements Action {
    public readonly type = ActionTypes.RegisterContact;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        contact: factory.transaction.placeOrder.ICustomerContact;
    }) { }
}

/**
 * RegisterContactSuccess
 */
export class RegisterContactSuccess implements Action {
    public readonly type = ActionTypes.RegisterContactSuccess;
    constructor(public payload: { customerContact: factory.transaction.placeOrder.ICustomerContact }) { }
}

/**
 * RegisterContactFail
 */
export class RegisterContactFail implements Action {
    public readonly type = ActionTypes.RegisterContactFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * AuthorizeCreditCard
 */
export class AuthorizeCreditCard implements Action {
    public readonly type = ActionTypes.AuthorizeCreditCard;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        authorizeCreditCardPayment?: factory.action.authorize.paymentMethod.creditCard.IAction;
        orderCount: number;
        amount: number;
        method: string;
        gmoTokenObject: IGmoTokenObject;
    }) { }
}

/**
 * AuthorizeCreditCardSuccess
 */
export class AuthorizeCreditCardSuccess implements Action {
    public readonly type = ActionTypes.AuthorizeCreditCardSuccess;
    constructor(public payload: {
        authorizeCreditCardPayment: factory.action.authorize.paymentMethod.creditCard.IAction
    }) { }
}

/**
 * AuthorizeCreditCardFail
 */
export class AuthorizeCreditCardFail implements Action {
    public readonly type = ActionTypes.AuthorizeCreditCardFail;
    constructor(public payload: { error: Error; }) { }
}

/**
 * AuthorizeMovieTicket
 */
export class AuthorizeMovieTicket implements Action {
    public readonly type = ActionTypes.AuthorizeMovieTicket;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[];
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[];
        pendingMovieTickets: IMovieTicket[];
    }) { }
}

/**
 * AuthorizeMovieTicketSuccess
 */
export class AuthorizeMovieTicketSuccess implements Action {
    public readonly type = ActionTypes.AuthorizeMovieTicketSuccess;
    constructor(public payload: {
        authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[]
    }) { }
}

/**
 * AuthorizeMovieTicketFail
 */
export class AuthorizeMovieTicketFail implements Action {
    public readonly type = ActionTypes.AuthorizeMovieTicketFail;
    constructor(public payload: { error: Error; }) { }
}

/**
 * CheckMovieTicket
 */
export class CheckMovieTicket implements Action {
    public readonly type = ActionTypes.CheckMovieTicket;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
        movieTickets: {
            typeOf: factory.paymentMethodType.MovieTicket;
            identifier: string;
            accessCode: string;
        }[];
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    }) { }
}

/**
 * CheckMovieTicketSuccess
 */
export class CheckMovieTicketSuccess implements Action {
    public readonly type = ActionTypes.CheckMovieTicketSuccess;
    constructor(public payload: { checkMovieTicketAction: factory.action.check.paymentMethod.movieTicket.IAction }) { }
}

/**
 * CheckMovieTicketFail
 */
export class CheckMovieTicketFail implements Action {
    public readonly type = ActionTypes.CheckMovieTicketFail;
    constructor(public payload: { error: Error; }) { }
}

/**
 * Reserve
 */
export class Reserve implements Action {
    public readonly type = ActionTypes.Reserve;
    constructor(public payload: {
        transaction: factory.transaction.placeOrder.ITransaction;
    }) { }
}

/**
 * ReserveSuccess
 */
export class ReserveSuccess implements Action {
    public readonly type = ActionTypes.ReserveSuccess;
    constructor(public payload: { order: factory.order.IOrder; }) { }
}

/**
 * ReserveFail
 */
export class ReserveFail implements Action {
    public readonly type = ActionTypes.ReserveFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * CreateGmoTokenObject
 */
export class CreateGmoTokenObject implements Action {
    public readonly type = ActionTypes.CreateGmoTokenObject;
    constructor(public payload: {
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        },
        seller: factory.seller.IOrganization<factory.seller.IAttributes<factory.organizationType>>;
    }) { }
}

/**
 * CreateGmoTokenObjectSuccess
 */
export class CreateGmoTokenObjectSuccess implements Action {
    public readonly type = ActionTypes.CreateGmoTokenObjectSuccess;
    constructor(public payload: { gmoTokenObject: IGmoTokenObject; }) { }
}

/**
 * CreateGmoTokenObjectFail
 */
export class CreateGmoTokenObjectFail implements Action {
    public readonly type = ActionTypes.CreateGmoTokenObjectFail;
    constructor(public payload: { error: Error }) { }
}


/**
 * Actions
 */
export type Actions =
    | Delete
    | UnsettledDelete
    | SelectSeller
    | SelectScheduleDate
    | GetPreScheduleDates
    | GetPreScheduleDatesSuccess
    | GetPreScheduleDatesFail
    | SelectSchedule
    | StartTransaction
    | StartTransactionSuccess
    | StartTransactionFail
    | GetScreen
    | GetScreenSuccess
    | GetScreenFail
    | SelectSeats
    | CancelSeats
    | GetTicketList
    | GetTicketListSuccess
    | GetTicketListFail
    | SelectTickets
    | TemporaryReservation
    | TemporaryReservationSuccess
    | TemporaryReservationFail
    | TemporaryReservationFreeSeat
    | TemporaryReservationFreeSeatSuccess
    | TemporaryReservationFreeSeatFail
    | CancelTemporaryReservations
    | CancelTemporaryReservationsSuccess
    | CancelTemporaryReservationsFail
    | RegisterContact
    | RegisterContactSuccess
    | RegisterContactFail
    | AuthorizeCreditCard
    | AuthorizeCreditCardSuccess
    | AuthorizeCreditCardFail
    | AuthorizeMovieTicket
    | AuthorizeMovieTicketSuccess
    | AuthorizeMovieTicketFail
    | CheckMovieTicket
    | CheckMovieTicketSuccess
    | CheckMovieTicketFail
    | Reserve
    | ReserveSuccess
    | ReserveFail
    | CreateGmoTokenObject
    | CreateGmoTokenObjectSuccess
    | CreateGmoTokenObjectFail;
