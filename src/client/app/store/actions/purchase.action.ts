import { factory } from '@cinerino/api-javascript-client';
import { Action } from '@ngrx/store';
import { IGmoTokenObject } from '../../functions';
import { IReservationSeat, IScreen, Reservation } from '../../models';

/**
 * Action types
 */
export enum ActionTypes {
    Delete = '[Purchase] Delete',
    UnsettledDelete = '[Purchase] Unsettled Delete',
    GetTheaters = '[Purchase] Get Theaters',
    GetTheatersSuccess = '[Purchase] Get Theaters Success',
    GetTheatersFail = '[Purchase] Get Theaters Fail',
    SelectTheater = '[Purchase] Select Theater',
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
    SelectSeats = '[Purchase] Select Seats',
    CancelSeats = '[Purchase] Cancel Seats',
    GetTicketList = '[Purchase] Get Ticket List',
    GetTicketListSuccess = '[Purchase] Get Ticket List Success',
    GetTicketListFail = '[Purchase] Get Ticket List Fail',
    SelectTickets = '[Purchase] Select Tickets',
    TemporaryReservation = '[Purchase] Temporary Reservation',
    TemporaryReservationSuccess = '[Purchase] Temporary Reservation Success',
    TemporaryReservationFail = '[Purchase] Temporary Reservation Fail',
    CancelTemporaryReservation = '[Purchase] Cancel Temporary Reservation',
    CancelTemporaryReservationSuccess = '[Purchase] Cancel Temporary Reservation Success',
    CancelTemporaryReservationFail = '[Purchase] Cancel Temporary Reservation Fail',
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
    CreateGmoTokenObject = '[Purchase] Create Gmo Token Object',
    CreateGmoTokenObjectSuccess = '[Purchase] Create Gmo Token Object Success',
    CreateGmoTokenObjectFail = '[Purchase] Create Gmo Token Object Fail',
    AddShoppingCart = '[Purchase] Add Shopping Cart',
    RemoveShoppingCart = '[Purchase] Remove Shopping Cart',
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
 * GetTheaters
 */
export class GetTheaters implements Action {
    public readonly type = ActionTypes.GetTheaters;
    constructor(public payload: { params: factory.organization.ISearchConditions<factory.organizationType.MovieTheater> }) { }
}

/**
 * GetTheatersSuccess
 */
export class GetTheatersSuccess implements Action {
    public readonly type = ActionTypes.GetTheatersSuccess;
    constructor(public payload: { movieTheaters: factory.organization.IOrganization<factory.organizationType.MovieTheater>[] }) { }
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
    constructor(public payload: { movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater> }) { }
}

/**
 * GetSchedule
 */
export class GetSchedule implements Action {
    public readonly type = ActionTypes.GetSchedule;
    constructor(public payload: {
        movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater>;
        scheduleDate: string;
    }) { }
}

/**
 * GetScheduleSuccess
 */
export class GetScheduleSuccess implements Action {
    public readonly type = ActionTypes.GetScheduleSuccess;
    constructor(public payload: {
        screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
        scheduleDate: string;
    }) { }
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
        movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater>;
        clientId: string;
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
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
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
 * CancelTemporaryReservation
 */
export class CancelTemporaryReservation implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservation;
    constructor(public payload: {
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }) { }
}

/**
 * CancelTemporaryReservationSuccess
 */
export class CancelTemporaryReservationSuccess implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservationSuccess;
    constructor(public payload?: {}) { }
}

/**
 * CancelTemporaryReservationFail
 */
export class CancelTemporaryReservationFail implements Action {
    public readonly type = ActionTypes.CancelTemporaryReservationFail;
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
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
        reservations: Reservation[];
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
        movieTheater: factory.organization.IOrganization<factory.organizationType.MovieTheater>;
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
 * AddShoppingCart
 */
export class AddShoppingCart implements Action {
    public readonly type = ActionTypes.AddShoppingCart;
    constructor(public payload: {
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }) { }
}

/**
 * RemoveShoppingCart
 */
export class RemoveShoppingCart implements Action {
    public readonly type = ActionTypes.RemoveShoppingCart;
    constructor(public payload: {
        authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    }) { }
}


/**
 * Actions
 */
export type Actions =
    | Delete
    | UnsettledDelete
    | GetTheaters
    | GetTheatersSuccess
    | GetTheatersFail
    | SelectTheater
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
    | SelectSeats
    | CancelSeats
    | GetTicketList
    | GetTicketListSuccess
    | GetTicketListFail
    | SelectTickets
    | TemporaryReservation
    | TemporaryReservationSuccess
    | TemporaryReservationFail
    | CancelTemporaryReservation
    | CancelTemporaryReservationSuccess
    | CancelTemporaryReservationFail
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
    | OrderAuthorizeFail
    | CreateGmoTokenObject
    | CreateGmoTokenObjectSuccess
    | CreateGmoTokenObjectFail
    | AddShoppingCart
    | RemoveShoppingCart;
