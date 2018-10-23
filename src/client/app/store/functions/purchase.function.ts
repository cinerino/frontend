import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { Reservation } from '../../models';

export interface IScreeningEventDate {
    string: string;
    format: string;
    data: factory.chevre.event.screeningEvent.IEvent;
}

export interface IScreeningEventFilm {
    info: factory.chevre.event.screeningEvent.IEvent;
    data: factory.chevre.event.screeningEvent.IEvent[];
}

export interface IGmoTokenObject {
    token: string;
    toBeExpiredAt: string;
    maskedCardNo: string;
    isSecurityCodeSet: boolean;
}

/**
 * 作品別イベント作成
 */
export function createscreeningEventDates(screeningEvents: factory.chevre.event.screeningEvent.IEvent[]) {
    const dates: IScreeningEventDate[] = [];
    screeningEvents.forEach((screeningEvent) => {
        const registered = dates.find((date) => {
            return (date.format === moment(screeningEvent.startDate).format('YYYYMMDD'));
        });
        if (registered === undefined) {
            dates.push({
                string: moment(screeningEvent.startDate).format('MM/DD (ddd)'),
                format: moment(screeningEvent.startDate).format('YYYYMMDD'),
                data: screeningEvent
            });
        }
    });

    return dates;
}

/**
 * 作品別イベント作成
 */
export function createScreeningFilmEvents(params: {
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[],
    scheduleDate: IScreeningEventDate
}) {
    const films: IScreeningEventFilm[] = [];
    const screeningEvents = params.screeningEvents.filter((screeningEvent) => {
        return (params.scheduleDate.format === moment(screeningEvent.startDate).format('YYYYMMDD'));
    });
    screeningEvents.forEach((screeningEvent) => {
        const registered = films.find((film) => {
            return (film.info.superEvent.id === screeningEvent.superEvent.id);
        });
        if (registered === undefined) {
            films.push({
                info: screeningEvent,
                data: [screeningEvent]
            });
        } else {
            registered.data.push(screeningEvent);
        }
    });

    return films;
}

/**
 * オーダーID生成
 */
export function createOrderId(params: {
    orderCount: number;
    authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction;
    movieTheater: factory.organization.movieTheater.IOrganization;
}) {
    const date = moment().format('YYYYMMDDHHmmss');
    const theaterCode = params.movieTheater.location.branchCode;
    // const reservationId = params.authorizeSeatReservation.id;
    return `${date}${theaterCode}${params.orderCount}`;
}

/**
 * GMOトークンオブジェクト生成
 */
export function createGmoTokenObject(params: {
    creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    },
    movieTheater: factory.organization.movieTheater.IOrganization;
}) {
    return new Promise<IGmoTokenObject>((resolve, reject) => {
        if (params.movieTheater.paymentAccepted === undefined) {
            throw new Error('movieTheater.paymentAccepted is undefined');
        }
        const findPaymentAcceptedResult = params.movieTheater.paymentAccepted.find((paymentAccepted) => {
            return (paymentAccepted.paymentMethodType === factory.paymentMethodType.CreditCard);
        });
        if (findPaymentAcceptedResult === undefined
            || findPaymentAcceptedResult.paymentMethodType !== factory.paymentMethodType.CreditCard) {
            throw new Error('paymentMethodType CreditCard not found');
        }
        (<any>window).someCallbackFunction = function someCallbackFunction(response: {
            resultCode: string;
            tokenObject: IGmoTokenObject
        }) {
            if (response.resultCode === '000') {
                resolve(response.tokenObject);
            } else {
                reject(new Error(response.resultCode));
            }
        };
        const Multipayment = (<any>window).Multipayment;
        Multipayment.init(findPaymentAcceptedResult.gmoInfo.shopId);
        Multipayment.getToken(params.creditCard, (<any>window).someCallbackFunction);
    });
}

/**
 * ムビチケ検索
 */
export function sameMovieTicketFilter(args: {
    checkMovieTicketActions: factory.action.check.paymentMethod.movieTicket.IAction[];
    checkMovieTicketAction: factory.action.check.paymentMethod.movieTicket.IAction;
}) {
    const checkMovieTicketAction = args.checkMovieTicketAction;
    const checkMovieTicketActions = args.checkMovieTicketActions;
    if (checkMovieTicketAction.result === undefined
        || checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut === null
        || checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknInfo === null) {
        return [];
    }
    const result: factory.action.check.paymentMethod.movieTicket.IAction[] = [];
    checkMovieTicketActions.forEach((action) => {
        if (action.result === undefined
            || action.result.purchaseNumberAuthResult.knyknrNoInfoOut === null
            || action.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknInfo === null) {
            return;
        }
        if (action.object.movieTickets[0].identifier !== checkMovieTicketAction.object.movieTickets[0].identifier) {
            return;
        }
        result.push(action);
    });

    return result;
}

/**
 * ムビチケ有効
 */
export function isAvailabilityMovieTicket(checkMovieTicketAction: factory.action.check.paymentMethod.movieTicket.IAction) {
    return (checkMovieTicketAction.result !== undefined
        && checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut !== null
        && checkMovieTicketAction.result.purchaseNumberAuthResult.knyknrNoInfoOut[0].ykknInfo !== null);
}

/**
 *  予約情報からムビチケ情報作成
 */
export function createMovieTicketsFromAuthorizeSeatReservation(args: {
    authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction;
    reservations: Reservation[];
}) {
    const results: factory.paymentMethod.paymentCard.movieTicket.IMovieTicket[] = [];
    const authorizeSeatReservation = args.authorizeSeatReservation;
    const reservations = args.reservations;
    if (authorizeSeatReservation.result === undefined) {
        return results;
    }
    const pendingReservations = authorizeSeatReservation.result.responseBody.object.reservations;

    pendingReservations.forEach((pendingReservation) => {
        const findReservationResult = reservations.find((reservation) => {
            return (reservation.seat.seatNumber === pendingReservation.reservedTicket.ticketedSeat.seatNumber);
        });
        if (findReservationResult === undefined
            || findReservationResult.ticket === undefined
            || findReservationResult.ticket.movieTicket === undefined) {
            return;
        }

        results.push({
            typeOf: factory.paymentMethodType.MovieTicket,
            identifier: findReservationResult.ticket.movieTicket.identifier,
            accessCode: findReservationResult.ticket.movieTicket.accessCode,
            serviceType: findReservationResult.ticket.movieTicket.serviceType,
            serviceOutput: {
                reservationFor: {
                    typeOf: pendingReservation.reservationFor.typeOf,
                    id: pendingReservation.reservationFor.id
                },
                reservedTicket: { ticketedSeat: pendingReservation.reservedTicket.ticketedSeat }
            }
        });
    });

    return results;
}
