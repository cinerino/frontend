import { factory } from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { Reservation } from '../models';

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
export function createScreeningFilmEvents(params: {
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[]
}) {
    const films: IScreeningEventFilm[] = [];
    const screeningEvents = params.screeningEvents;
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
    transaction: factory.transaction.placeOrder.ITransaction
}) {
    const DIGITS = { '02': -2, '06': -6 };
    const prefix = environment.APP_PREFIX;
    const date = moment().format('YYMMDDHHmmss');
    const orderCount = `00${params.orderCount}`.slice(DIGITS['02']);
    const transactionId = `000000${params.transaction.id}`.slice(DIGITS['06']);
    return `${prefix}-${date}${transactionId}${orderCount}`;
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

/**
 * 支払い方法作成
 */
export function createPaymentMethodFromType(args: {
    paymentMethodType: factory.paymentMethodType | string;
    paymentMethodName?: string;
}) {
    switch (args.paymentMethodType) {
        case factory.paymentMethodType.Cash: {
            return { typeOf: args.paymentMethodType, name: '現金' };
        }
        case factory.paymentMethodType.CreditCard: {
            return { typeOf: args.paymentMethodType, name: 'クレジットカード' };
        }
        case factory.paymentMethodType.EMoney: {
            return { typeOf: args.paymentMethodType, name: '電子マネー' };
        }
        default: {
            return {
                typeOf: args.paymentMethodType,
                name: (args.paymentMethodName === undefined) ? 'その他' : args.paymentMethodName
            };
        }
    }
}

type IItemOffered = factory.chevre.reservation.event.IReservation<factory.chevre.event.screeningEvent.IEvent>;

/**
 * 券種金額取得
 */
export function getTicketPrice(ticket: factory.chevre.event.screeningEvent.ITicketOffer | factory.order.IAcceptedOffer<IItemOffered>) {
    const result = {
        unitPriceSpecification: 0,
        videoFormatCharge: 0,
        soundFormatCharge: 0,
        movieTicketTypeCharge: 0,
        total: 0,
        single: 0
    };
    if (ticket.priceSpecification === undefined) {
        return result;
    }
    const priceComponent = (<factory.chevre.event.screeningEvent.ITicketPriceSpecification>ticket.priceSpecification).priceComponent;
    const priceSpecificationType = factory.chevre.priceSpecificationType;
    const unitPriceSpecifications = priceComponent.filter((s) => s.typeOf === priceSpecificationType.UnitPriceSpecification);
    const videoFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.VideoFormatChargeSpecification);
    const soundFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.SoundFormatChargeSpecification);
    const movieTicketTypeCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.MovieTicketTypeChargeSpecification);

    result.unitPriceSpecification += unitPriceSpecifications[0].price;
    videoFormatCharges.forEach((videoFormatCharge) => {
        result.videoFormatCharge += videoFormatCharge.price;
    });
    soundFormatCharges.forEach((soundFormatCharge) => {
        result.soundFormatCharge += soundFormatCharge.price;
    });
    movieTicketTypeCharges.forEach((movieTicketTypeCharge) => {
        result.movieTicketTypeCharge += movieTicketTypeCharge.price;
    });
    result.total = result.unitPriceSpecification + result.videoFormatCharge + result.soundFormatCharge + result.movieTicketTypeCharge;
    const unitPriceSpecification = unitPriceSpecifications[0];
    if (unitPriceSpecification.typeOf === priceSpecificationType.UnitPriceSpecification) {
        const referenceQuantityValue = (unitPriceSpecification.referenceQuantity.value === undefined)
            ? 1
            : unitPriceSpecification.referenceQuantity.value;
        result.single = result.total / referenceQuantityValue;
    }

    return result;
}

/**
 * ムビチケ認証購入管理番号無効事由区分変換
 */
export function movieTicketAuthErroCodeToMessage(code?: string) {
    switch (code) {
        case '01': {
            return '存在無';
        }
        case '02': {
            return 'PINｺｰﾄﾞ必須';
        }
        case '03': {
            return 'PINｺｰﾄﾞ認証ｴﾗｰ';
        }
        case '04': {
            return '作品不一致';
        }
        case '05': {
            return '未ｱｸﾃｨﾍﾞｰﾄ';
        }
        case '06': {
            return '選択興行対象外';
        }
        case '07': {
            return '有効期限切れ';
        }
        case '08': {
            return '座席予約期間外';
        }
        case '09': {
            return 'その他';
        }
        case '11': {
            return '座席予約開始前';
        }
        case '12': {
            return '仮お直り購入番号数不一致';
        }
        default: {
            return 'その他';
        }
    }
}
