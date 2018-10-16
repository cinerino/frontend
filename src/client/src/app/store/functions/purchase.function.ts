import { factory } from '@cinerino/api-javascript-client';
import * as libphonenumber from 'libphonenumber-js';
import * as moment from 'moment';

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
 * 電話番号変換
 */
export function formatTelephone(telephone: string) {
    const parseNumber = libphonenumber.parse(telephone, 'JP');

    return libphonenumber.format(parseNumber, 'International').replace(/\s/g, '');
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
