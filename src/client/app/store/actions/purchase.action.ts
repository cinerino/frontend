import { IAuthorizeAction } from '@cinerino/api-abstract-client/lib/service/transaction/placeOrder';
import { factory } from '@cinerino/api-javascript-client';
import { IResult } from '@cinerino/factory/lib/factory/transaction/placeOrder';
import { Action } from '@ngrx/store';
import { IReservationSeat, IScreen, Reservation } from '../../models';
import { IScreeningEventDate } from '../functions';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Purchase] Delete',
    GetTheaters = '[Purchase] Get Theaters',
    GetTheatersSuccess = '[Purchase] Get Theaters Success',
    GetTheatersFail = '[Purchase] Get Theaters Fail',
    SelectTheater = '[Purchase] Select Theater',
    SelectScheduleDate = '[Purchase] Select Schedule Date',
    GetSchedule = '[Purchase] Get Schedule',
    GetScheduleSuccess = '[Purchase] Get Schedule Success',
    GetScheduleFail = '[Purchase] Get Schedule Fail',
    SelectSchedule = '[Purchase] Select Schedule',
    StartTransaction = '[Purchase] Start Transaction',
    StartTransactionSuccess = '[Purchase] Start Transaction Success',
    StartTransactionFail = '[Purchase] Start Transaction Fail',
    GetScreen = '[Purchase] Get Screen',
    GetScreenSuccess = '[Purchase] Get Screen Success',
    GetScreenFail = '[Purchase] Get Screen Fail',
    SelectSeat = '[Purchase] Select Seat',
    CancelSeat = '[Purchase] Cancel Seat',
    GetTicketList = '[Purchase] Get Ticket List',
    GetTicketListSuccess = '[Purchase] Get Ticket List Success',
    GetTicketListFail = '[Purchase] Get Ticket List Fail',
    SelectTicket = '[Purchase] Select Ticket',
    TemporaryReservation = '[Purchase] Temporary Reservation',
    TemporaryReservationSuccess = '[Purchase] Temporary Reservation Success',
    TemporaryReservationFail = '[Purchase] Temporary Reservation Fail',
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
    GetPurchaseHistory = '[Purchase] Get Purchase History',
    GetPurchaseHistorySuccess = '[Purchase] Get Purchase History Success',
    GetPurchaseHistoryFail = '[Purchase] Get Purchase History Fail',
    OrderAuthorize = '[Purchase] Order Authorize',
    OrderAuthorizeSuccess = '[Purchase] Order Authorize Success',
    OrderAuthorizeFail = '[Purchase] Order Authorize Fail',
}

/**
 * Delete
 */
export class Delete implements Action {
    public readonly type = ActionTypes.Delete;
    constructor(public payload?: {}) { }
}

/**
 * GetTheaters
 */
export class GetTheaters implements Action {
    public readonly type = ActionTypes.GetTheaters;
    constructor(public payload: { params: factory.organization.movieTheater.ISearchConditions }) { }
}

/**
 * GetTheatersSuccess
 */
export class GetTheatersSuccess implements Action {
    public readonly type = ActionTypes.GetTheatersSuccess;
    constructor(public payload: { movieTheaters: factory.organization.movieTheater.IOrganization[] }) { }
}

/**
 * GetTheatersFail
 */
export class GetTheatersFail implements Action {
    public readonly type = ActionTypes.GetTheatersFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * SelectTheater
 */
export class SelectTheater implements Action {
    public readonly type = ActionTypes.SelectTheater;
    constructor(public payload: { movieTheater: factory.organization.movieTheater.IOrganization }) { }
}

/**
 * SelectScheduleDate
 */
export class SelectScheduleDate implements Action {
    public readonly type = ActionTypes.SelectScheduleDate;
    constructor(public payload: { scheduleDate: IScreeningEventDate }) { }
}

/**
 * GetSchedule
 */
export class GetSchedule implements Action {
    public readonly type = ActionTypes.GetSchedule;
    constructor(public payload: { params: factory.chevre.event.screeningEvent.ISearchConditions }) { }
}

/**
 * GetScheduleSuccess
 */
export class GetScheduleSuccess implements Action {
    public readonly type = ActionTypes.GetScheduleSuccess;
    constructor(public payload: { screeningEvents: factory.chevre.event.screeningEvent.IEvent[] }) { }
}

/**
 * GetScheduleFail
 */
export class GetScheduleFail implements Action {
    public readonly type = ActionTypes.GetScheduleFail;
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
 * SelectSeat
 */
export class SelectSeat implements Action {
    public readonly type = ActionTypes.SelectSeat;
    constructor(public payload: { seat: IReservationSeat }) { }
}

/**
 * CancelSeat
 */
export class CancelSeat implements Action {
    public readonly type = ActionTypes.CancelSeat;
    constructor(public payload: { seat: IReservationSeat }) { }
}

/**
 * SelectTicket
 */
export class SelectTicket implements Action {
    public readonly type = ActionTypes.SelectTicket;
    constructor(public payload: { reservation: Reservation }) { }
}

/**
 * GetTicketList
 */
export class GetTicketList implements Action {
    public readonly type = ActionTypes.GetTicketList;
    constructor(public payload: { screeningEvent: factory.chevre.event.screeningEvent.IEvent }) { }
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
        authorizeSeatReservation?: factory.action.authorize.offer.seatReservation.IAction;
        reservations: Reservation[];
    }) { }
}

/**
 * TemporaryReservationSuccess
 */
export class TemporaryReservationSuccess implements Action {
    public readonly type = ActionTypes.TemporaryReservationSuccess;
    constructor(public payload: { authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction; }) { }
}

/**
 * TemporaryReservationFail
 */
export class TemporaryReservationFail implements Action {
    public readonly type = ActionTypes.TemporaryReservationFail;
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
        movieTheater: factory.organization.movieTheater.IOrganization;
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction;
        authorizeCreditCardPayment?: IAuthorizeAction;
        orderCount: number;
        amount: number;
        method: string;
        creditCard: {
            cardno: string;
            expire: string;
            holderName: string;
            securityCode: string;
        };
    }) { }
}

/**
 * AuthorizeCreditCardSuccess
 */
export class AuthorizeCreditCardSuccess implements Action {
    public readonly type = ActionTypes.AuthorizeCreditCardSuccess;
    constructor(public payload: { authorizeCreditCardPayment: IAuthorizeAction, gmoTokenObject: any }) { }
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
        authorizeMovieTicketPayment?: IAuthorizeAction;
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction;
        reservations: Reservation[];
    }) { }
}

/**
 * AuthorizeMovieTicketSuccess
 */
export class AuthorizeMovieTicketSuccess implements Action {
    public readonly type = ActionTypes.AuthorizeMovieTicketSuccess;
    constructor(public payload: { authorizeMovieTicketPayment: IAuthorizeAction }) { }
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
    constructor(public payload: { result: IResult }) { }
}

/**
 * ReserveFail
 */
export class ReserveFail implements Action {
    public readonly type = ActionTypes.ReserveFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * GetPurchaseHistory
 */
export class GetPurchaseHistory implements Action {
    public readonly type = ActionTypes.GetPurchaseHistory;
    constructor(public payload: { params: factory.order.ISearchConditions }) { }
}

/**
 * GetPurchaseHistorySuccess
 */
export class GetPurchaseHistorySuccess implements Action {
    public readonly type = ActionTypes.GetPurchaseHistorySuccess;
    constructor(public payload: { result: factory.order.IOrder[] }) { }
}

/**
 * GetPurchaseHistoryFail
 */
export class GetPurchaseHistoryFail implements Action {
    public readonly type = ActionTypes.GetPurchaseHistoryFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * OrderAuthorize
 */
export class OrderAuthorize implements Action {
    public readonly type = ActionTypes.OrderAuthorize;
    constructor(public payload: {
        params: {
            orderNumber: string;
            customer: {
                email?: string;
                telephone?: string;
            };
        }
    }) { }
}

/**
 * OrderAuthorizeSuccess
 */
export class OrderAuthorizeSuccess implements Action {
    public readonly type = ActionTypes.OrderAuthorizeSuccess;
    constructor(public payload: { order: factory.order.IOrder }) { }
}

/**
 * OrderAuthorizeFail
 */
export class OrderAuthorizeFail implements Action {
    public readonly type = ActionTypes.OrderAuthorizeFail;
    constructor(public payload: { error: Error }) { }
}

/**
 * Actions
 */
export type Actions =
    | Delete
    | GetTheaters
    | GetTheatersSuccess
    | GetTheatersFail
    | SelectTheater
    | SelectScheduleDate
    | GetSchedule
    | GetScheduleSuccess
    | GetScheduleFail
    | SelectSchedule
    | StartTransaction
    | StartTransactionSuccess
    | StartTransactionFail
    | GetScreen
    | GetScreenSuccess
    | GetScreenFail
    | SelectSeat
    | CancelSeat
    | GetTicketList
    | GetTicketListSuccess
    | GetTicketListFail
    | SelectTicket
    | TemporaryReservation
    | TemporaryReservationSuccess
    | TemporaryReservationFail
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
    | GetPurchaseHistory
    | GetPurchaseHistorySuccess
    | GetPurchaseHistoryFail
    | OrderAuthorize
    | OrderAuthorizeSuccess
    | OrderAuthorizeFail;
