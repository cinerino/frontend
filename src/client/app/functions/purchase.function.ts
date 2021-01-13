import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { getEnvironment } from '../../environments/environment';
import { Reservation } from '../models/purchase';
import { IMovieTicket } from './../models/purchase/movieTicket';
import { Performance } from './../models/purchase/performance';

/**
 * イベントグループ
 */
export interface IScreeningEventsGroup {
    screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    data: Performance[];
}

/**
 * 施設コンテンツごとのグループへ変換
 */
export function screeningEvents2ScreeningEventSeries(params: {
    screeningEvents: factory.chevre.event.screeningEvent.IEvent[]
}) {
    const environment = getEnvironment();
    const result: IScreeningEventsGroup[] = [];
    const screeningEvents = params.screeningEvents;
    screeningEvents.forEach((screeningEvent) => {
        const registered = result.find((data) => {
            if (environment.PURCHASE_SCHEDULE_SORT === 'screeningEventSeries') {
                return (data.screeningEvent.superEvent.id === screeningEvent.superEvent.id);
            } else {
                return (data.screeningEvent.location.branchCode === screeningEvent.location.branchCode);
            }
        });
        const performance = new Performance(screeningEvent);
        if (registered === undefined) {
            result.push({
                screeningEvent,
                data: [performance]
            });
        } else {
            registered.data.push(performance);
        }
    });

    return result;
}

/**
 * GMOトークンオブジェクト
 */
export interface IGmoTokenObject {
    token: string;
    toBeExpiredAt: string;
    maskedCardNo: string;
    isSecurityCodeSet: boolean;
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
    seller: factory.chevre.seller.ISeller;
}) {
    return new Promise<IGmoTokenObject>((resolve, reject) => {
        if (params.seller.paymentAccepted === undefined) {
            throw new Error('seller.paymentAccepted is undefined');
        }
        const findPaymentAcceptedResult = params.seller.paymentAccepted.find((paymentAccepted) => {
            return (paymentAccepted.paymentMethodType === factory.paymentMethodType.CreditCard);
        });
        if (findPaymentAcceptedResult === undefined
            || findPaymentAcceptedResult.paymentMethodType !== factory.paymentMethodType.CreditCard
            || (<any>findPaymentAcceptedResult).gmoInfo === undefined) {
            throw new Error('paymentMethodType CreditCard or gmoInfo undefined');
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
        Multipayment.init((<any>findPaymentAcceptedResult).gmoInfo?.shopId);
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
    authorizeSeatReservation: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>;
    pendingMovieTickets: IMovieTicket[];
    seller: factory.chevre.seller.ISeller;
}) {
    const results: factory.chevre.paymentMethod.paymentCard.movieTicket.IMovieTicket[] = [];
    const authorizeSeatReservation = args.authorizeSeatReservation;
    const pendingMovieTickets = args.pendingMovieTickets;
    const seller = args.seller;
    if (authorizeSeatReservation.result === undefined) {
        return [];
    }
    const pendingReservations =
        (<factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>[]>
            (<any>authorizeSeatReservation.result.responseBody).object.reservations);

    pendingReservations.forEach((pendingReservation) => {
        if (pendingReservation.price === undefined
            || typeof pendingReservation.price === 'number') {
            return;
        }
        const findMovieTicketTypeChargeSpecification =
            pendingReservation.price.priceComponent.find(
                p => p.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification
            );
        if (findMovieTicketTypeChargeSpecification === undefined) {
            return;
        }
        const findPendingMovieTicket = pendingMovieTickets.find((pendingMovieTicket) => {
            return (pendingMovieTicket.id === authorizeSeatReservation.id);
        });
        if (findPendingMovieTicket === undefined) {
            return;
        }
        const findReservation = findPendingMovieTicket.movieTickets.find((movieTicket) => {
            const seatNumber = movieTicket.serviceOutput.reservedTicket.ticketedSeat.seatNumber;
            const seatSection = movieTicket.serviceOutput.reservedTicket.ticketedSeat.seatSection;
            return (pendingReservation.reservedTicket.ticketedSeat !== undefined
                && seatNumber === pendingReservation.reservedTicket.ticketedSeat.seatNumber
                && seatSection === pendingReservation.reservedTicket.ticketedSeat.seatSection);
        });
        if (findReservation === undefined) {
            return;
        }

        results.push({
            typeOf: findReservation.typeOf,
            identifier: findReservation.identifier,
            accessCode: findReservation.accessCode,
            serviceType: findReservation.serviceType,
            serviceOutput: findReservation.serviceOutput,
            project: seller.project
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

/**
 * 券種金額取得
 * @deprecated 非推奨（廃止予定）
 */
export function getTicketPrice(
    ticket: factory.chevre.event.screeningEvent.ITicketOffer
        | factory.order.IAcceptedOffer<factory.order.IItemOffered>
        | factory.action.authorize.offer.seatReservation.IAcceptedOffer4chevre
) {
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
    const movieTicketTypeCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.MovieTicketTypeChargeSpecification);

    result.unitPriceSpecification += unitPriceSpecifications[0].price;
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
 * アイテム金額取得
 */
export function getItemPrice(params: {
    priceComponents?: factory.chevre.event.screeningEvent.ITicketPriceComponent[];
    seat?: Reservation.IReservationSeat;
}) {
    let price = 0;
    // 券種価格
    const priceComponents = params.priceComponents;
    if (priceComponents === undefined) {
        return price;
    }
    const priceSpecificationType = factory.chevre.priceSpecificationType;
    priceComponents.forEach((p) => {
        if (p.typeOf === priceSpecificationType.UnitPriceSpecification) {
            const value = (p.referenceQuantity.value) ? p.referenceQuantity.value : 1;
            price += p.price / value;
            return;
        }
        price += p.price;
    });
    // 座席価格
    const seat = params.seat;
    if (seat === undefined || seat.offers === undefined) {
        return price;
    }
    seat.offers.forEach((o) => {
        if (o.priceSpecification === undefined) {
            return;
        }
        o.priceSpecification.priceComponent.forEach(p => price += p.price);
    });
    return price;
}

/**
 * ムビチケ認証購入管理番号無効事由区分変換
 */
export function movieTicketAuthErroCodeToMessage(code?: string): { ja: string; en: string; } {
    const table = [
        { code: '01', ja: '存在無', en: 'no existence' },
        { code: '02', ja: 'PINｺｰﾄﾞ必須', en: 'PIN code required' },
        { code: '03', ja: 'PINｺｰﾄﾞ認証ｴﾗｰ', en: 'PIN code authentication error' },
        { code: '04', ja: '作品不一致', en: 'Work disagreement' },
        { code: '05', ja: '未ｱｸﾃｨﾍﾞｰﾄ', en: 'unactivated' },
        { code: '06', ja: '選択興行対象外', en: 'Not eligible for selection box' },
        { code: '07', ja: '有効期限切れ', en: 'expired' },
        { code: '08', ja: '座席予約期間外', en: 'outside the seat reservation period' },
        { code: '09', ja: 'その他', en: 'other' },
        { code: '11', ja: '座席予約開始前', en: 'Before starting seat reservation' },
        { code: '12', ja: '仮お直り購入番号数不一致', en: 'temporary redemption purchase number mismatch' }
    ];
    const findResult = table.find(data => data.code === code);
    return (findResult === undefined) ? { ja: 'その他', en: 'other' } : { ja: findResult.ja, en: findResult.en };
}

/**
 * 予約金額取得
 */
export function getAmount(
    authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
) {
    const amounts = authorizeSeatReservations.map(
        reservations => (reservations.result === undefined)
            ? 0
            : reservations.result.price
    );
    const amount = amounts.reduce((previousValue, currentValue) => previousValue + currentValue);

    return amount;
}

/**
 * イベント別オーダー
 */
export interface IEventOrder {
    event: factory.chevre.event.screeningEvent.IEvent;
    data: factory.order.IAcceptedOffer<factory.order.IItemOffered>[];
}

/**
 * イベント別オーダーへ変換
 */
export function order2EventOrders(params: {
    order: factory.order.IOrder
}) {
    const results: IEventOrder[] = [];
    const order = params.order;
    order.acceptedOffers.forEach((acceptedOffer) => {
        if (acceptedOffer.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
            return;
        }
        const itemOffered = <factory.chevre.reservation.IReservation<
            factory.chevre.reservationType.EventReservation
        >>acceptedOffer.itemOffered;
        const registered = results.find((result) => {
            return (result.event.id === itemOffered.reservationFor.id);
        });
        if (registered === undefined) {
            results.push({
                event: itemOffered.reservationFor,
                data: [acceptedOffer]
            });
        } else {
            registered.data.push(acceptedOffer);
        }
    });

    // 公開日順（降順）へソート
    const sortResult = results.sort((a, b) => {
        if (a.event.workPerformed === undefined
            || a.event.workPerformed.datePublished === undefined) {
            return 1;
        }
        if (b.event.workPerformed === undefined
            || b.event.workPerformed.datePublished === undefined) {
            return -1;
        }
        const unixA = moment(a.event.workPerformed.datePublished).unix();
        const unixB = moment(b.event.workPerformed.datePublished).unix();
        if (unixA > unixB) { return -1; }
        if (unixA < unixB) { return 1; }
        return 0;
    });

    return sortResult;
}

/**
 * 座席予約をイベントごとに変換
 */
export function authorizeSeatReservation2Event(params: {
    authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier>[]
}) {
    const results: {
        event: factory.chevre.event.screeningEvent.IEvent;
        reservations: factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>[]
    }[] = [];
    const authorizeSeatReservations = params.authorizeSeatReservations;
    authorizeSeatReservations.forEach((authorizeSeatReservation) => {
        if (authorizeSeatReservation.result === undefined) {
            return;
        }
        const reservations: factory.chevre.reservation.IReservation<factory.chevre.reservationType.EventReservation>[] =
            (<any>authorizeSeatReservation.result.responseBody).object.reservations;
        reservations.forEach((reservation) => {
            const registered = results.find((result) => {
                return (result.event.id === reservation.reservationFor.id);
            });
            if (registered === undefined) {
                results.push({
                    event: reservation.reservationFor,
                    reservations: [reservation]
                });
            } else {
                registered.reservations.push(reservation);
            }
        });
    });

    return results;
}

/**
 * 残席数取得
 */
export function getRemainingSeatLength(params: {
    screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    screeningEvent: factory.chevre.event.screeningEvent.IEvent;
}) {
    const screeningEventSeats = params.screeningEventSeats;
    const screeningEvent = params.screeningEvent;
    let result = 0;
    const limitSeatNumber = (screeningEvent.workPerformed === undefined
        || screeningEvent.workPerformed.additionalProperty === undefined)
        ? undefined : screeningEvent.workPerformed.additionalProperty.find(a => a.name === 'limitSeatNumber');
    const filterResult = screeningEventSeats.filter((s) => {
        if (limitSeatNumber !== undefined) {
            // 作品追加特性（limitSeatNumber）で座席数制御
            return (s.offers !== undefined
                && s.offers[0].availability === factory.chevre.itemAvailability.InStock
                && Number(s.branchCode) <= Number(limitSeatNumber.value));
        }
        return (s.offers !== undefined
            && s.offers[0].availability === factory.chevre.itemAvailability.InStock);
    });
    result += filterResult.length;

    const reservationCount = screeningEventSeats.filter((s) => {
        return (s.offers !== undefined
            && s.offers[0].availability === factory.chevre.itemAvailability.OutOfStock);
    }).length;

    if (screeningEvent.maximumAttendeeCapacity !== undefined
        && result > screeningEvent.maximumAttendeeCapacity - reservationCount) {
        result = screeningEvent.maximumAttendeeCapacity - reservationCount;
    }

    return result;
}

/**
 * 適用座席タイプ判定
 */
export function isEligibleSeatingType(params: {
    seat: Reservation.IReservationSeat;
    eligibleSeatingType: factory.chevre.categoryCode.ICategoryCode[]
}) {
    const seat = params.seat;
    const eligibleSeatingType = params.eligibleSeatingType;
    const filterResult = eligibleSeatingType.filter(e => {
        if (Array.isArray(seat.seatingType)) {
            return (seat.seatingType.find(s => e.codeValue === s) !== undefined);
        }
        return (e.codeValue === seat.seatingType);
    });
    return filterResult.length === eligibleSeatingType.length;
}

/**
 * 空席取得
 */
export function getEmptySeat(params: {
    reservations: Reservation.IReservation[];
    screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
}) {
    const reservations = params.reservations;
    const screeningEventSeats = params.screeningEventSeats;
    const seats: factory.chevre.reservation.ISeat<factory.chevre.reservationType.EventReservation>[] = [];
    screeningEventSeats.forEach(s => {
        const section = (s.containedInPlace === undefined || s.containedInPlace.branchCode === undefined)
            ? '' : s.containedInPlace.branchCode;
        const selectedSeat = reservations.find(r => {
            return (r.seat !== undefined
                && r.seat.seatNumber === s.branchCode
                && r.seat.seatSection === section);
        });
        if ((s.offers === undefined || s.offers[0].availability !== factory.chevre.itemAvailability.InStock)
            && selectedSeat === undefined) {
            // 在庫なし
            return;
        }
        seats.push({
            typeOf: s.typeOf,
            seatingType: s.seatingType,
            seatNumber: s.branchCode,
            seatRow: '',
            seatSection: section
        });
    });
    return seats;
}

/**
 * 予約可能席
 */
export interface IAvailableSeat extends factory.chevre.reservation.ISeat<factory.chevre.reservationType.EventReservation> {
    subReservations: factory.chevre.reservation.ISeat<factory.chevre.reservationType.EventReservation>[];
}

/**
 * 予約可能席取得
 */
export function selectAvailableSeat(params: {
    reservations: Reservation.IReservation[];
    screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
}) {
    const reservations = params.reservations;
    const screeningEventSeats = params.screeningEventSeats;
    const seats = getEmptySeat({ reservations, screeningEventSeats });
    const availableSeats: IAvailableSeat[] = [];
    reservations.forEach(r => {
        const findReservationSeat = seats.find(s => {
            const findReservedSeat = availableSeats.find(a => {
                const findSubReservedSeat =
                    a.subReservations.find(sub => sub.seatNumber === s.seatNumber && sub.seatSection === s.seatSection);
                if (findSubReservedSeat !== undefined) {
                    // サブ予約済み座席
                    return true;
                }
                return (a.seatNumber === s.seatNumber && a.seatSection === s.seatSection);
            });
            if (findReservedSeat !== undefined) {
                // 予約済み座席
                return false;
            }
            if (r.ticket !== undefined
                && r.ticket.ticketOffer.eligibleSeatingType !== undefined
                && !isEligibleSeatingType({ seat: s, eligibleSeatingType: r.ticket.ticketOffer.eligibleSeatingType })) {
                // 適用座席タイプ違い
                return false;
            }
            if (r.seat !== undefined) {
                // 座席選択済みの場合予約中の座席を選択
                return (r.seat.seatNumber === s.seatNumber && r.seat.seatSection === s.seatSection);
            }
            return true;
        });
        if (findReservationSeat === undefined) {
            // 予約可能席なし
            return;
        }
        if (r.ticket === undefined
            || r.ticket.ticketOffer.eligibleSubReservation === undefined) {
            // サブ予約なし
            availableSeats.push({ ...findReservationSeat, subReservations: [] });
            return;
        }
        // サブ予約分取得
        const subReservations: factory.chevre.reservation.ISeat<factory.chevre.reservationType.EventReservation>[] = [];
        r.ticket.ticketOffer.eligibleSubReservation.forEach(e => {
            for (let i = 0; i < e.amountOfThisGood; i++) {
                const subReservation = seats.find(s => {
                    const findReservedSeat = availableSeats.find(a => {
                        const findSubReservedSeat =
                            a.subReservations.find(sub => sub.seatNumber === s.seatNumber && sub.seatSection === s.seatSection);
                        if (findSubReservedSeat !== undefined) {
                            // サブ予約済み座席
                            return true;
                        }
                        return (a.seatNumber === s.seatNumber && a.seatSection === s.seatSection);
                    });
                    if (findReservedSeat !== undefined) {
                        // 予約済み座席
                        return false;
                    }
                    const findSubReservationSeat =
                        subReservations.find(sub => sub.seatNumber === s.seatNumber && sub.seatSection === s.seatSection);
                    if (findSubReservationSeat !== undefined) {
                        // サブ予約中座席
                        return false;
                    }
                    if (findReservationSeat.seatNumber === s.seatNumber
                        && findReservationSeat.seatSection === s.seatSection) {
                        // 予約中座席
                        return false;
                    }
                    if (Array.isArray(s.seatingType)
                        && s.seatingType.find(t => t === e.typeOfGood.seatingType) === undefined) {
                        // 適用座席タイプ違い
                        return false;
                    }
                    if (!Array.isArray(s.seatingType)
                        && s.seatingType !== e.typeOfGood.seatingType) {
                        // 適用座席タイプ違い
                        return false;
                    }
                    if (r.seat !== undefined) {
                        // 座席選択済みの場合予約中の座席以外を選択
                        return !(r.seat.seatNumber === s.seatNumber && r.seat.seatSection === s.seatSection);
                    }
                    return true;
                });
                if (subReservation === undefined) {
                    return;
                }
                subReservations.push(subReservation);
            }
        });
        availableSeats.push({ ...findReservationSeat, subReservations });
    });

    return availableSeats;
}

/**
 * ムビチケオファー取得
 */
export function getMovieTicketTypeOffers(params: {
    screeningEventTicketOffers: factory.chevre.event.screeningEvent.ITicketOffer[]
}) {
    const screeningEventTicketOffers = params.screeningEventTicketOffers;
    const result = screeningEventTicketOffers.filter(o => {
        const movieTicketTypeChargeSpecifications = o.priceSpecification.priceComponent.filter(p => {
            return (p.typeOf === factory.chevre.priceSpecificationType.MovieTicketTypeChargeSpecification);
        });
        return (movieTicketTypeChargeSpecifications.length > 0);
    });
    return result;
}
