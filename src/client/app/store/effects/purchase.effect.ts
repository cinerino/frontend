import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { Functions, Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
import { CinerinoService, LinyService, UtilService } from '../../services';
import { purchaseAction } from '../actions';
declare const ga: Function;

/**
 * Purchase Effects
 */
@Injectable()
export class PurchaseEffects {

    constructor(
        private actions: Actions,
        private cinerinoService: CinerinoService,
        private linyService: LinyService,
        private utilService: UtilService,
        private translate: TranslateService
    ) { }

    /**
     * getSeller
     */
    @Effect()
    public getSeller = this.actions.pipe(
        ofType(purchaseAction.getSeller),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerinoService.getServices();
                const id = payload.id;
                const seller = await this.cinerinoService.seller.findById({ id });
                return purchaseAction.getSellerSuccess({ seller });
            } catch (error) {
                return purchaseAction.getSellerFail({ error: error });
            }
        })
    );

    /**
     * GetPreScheduleDates
     */
    @Effect()
    public getPreScheduleDates = this.actions.pipe(
        ofType(purchaseAction.getPreScheduleDates),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const environment = getEnvironment();
                await this.cinerinoService.getServices();
                const now = moment((await this.utilService.getServerTime()).date).toDate();
                const today = moment(moment().format('YYYY-MM-DD')).toDate();
                const limit = 100;
                let page = 1;
                let roop = true;
                let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] = [];
                while (roop) {
                    const searchResult = await this.cinerinoService.event.search({
                        page,
                        limit,
                        typeOf: factory.chevre.eventType.ScreeningEvent,
                        eventStatuses: [factory.chevre.eventStatusType.EventScheduled],
                        superEvent: payload.superEvent,
                        startFrom: moment(today).add(environment.PURCHASE_PRE_SCHEDULE_DATE, 'days').toDate(),
                        offers: {
                            validFrom: now,
                            validThrough: now,
                            availableFrom: now,
                            availableThrough: now
                        }
                    });
                    screeningEvents = screeningEvents.concat(searchResult.data);
                    page++;
                    roop = searchResult.data.length === limit;
                    if (roop) {
                        await Functions.Util.sleep();
                    }
                }
                const sheduleDates: string[] = [];

                screeningEvents.forEach((screeningEvent) => {
                    const date = moment(screeningEvent.startDate).format('YYYY-MM-DD');
                    const findResult = sheduleDates.find(sheduleDat => sheduleDat === date);
                    if (findResult === undefined) {
                        sheduleDates.push(date);
                    }
                });

                return purchaseAction.getPreScheduleDatesSuccess({ sheduleDates });
            } catch (error) {
                return purchaseAction.getPreScheduleDatesFail({ error: error });
            }
        })
    );

    /**
     * StartTransaction
     */
    @Effect()
    public startTransaction = this.actions.pipe(
        ofType(purchaseAction.startTransaction),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const params = payload;
                const selleId = params.seller.id;
                await this.cinerinoService.getServices();
                const passport = (params.object.passport === undefined)
                    ? await this.cinerinoService.getPassport(selleId)
                    : params.object.passport;
                const transaction = await this.cinerinoService.transaction.placeOrder.start({
                    ...params,
                    object: { passport }
                });
                return purchaseAction.startTransactionSuccess({ transaction });
            } catch (error) {
                return purchaseAction.startTransactionFail({ error: error });
            }
        })
    );

    /**
     * CancelTransaction
     */
    @Effect()
    public cancelTransaction = this.actions.pipe(
        ofType(purchaseAction.cancelTransaction),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const transaction = payload.transaction;
                await this.cinerinoService.getServices();
                await this.cinerinoService.transaction.placeOrder.cancel({ id: transaction.id });
                return purchaseAction.cancelTransactionSuccess();
            } catch (error) {
                return purchaseAction.cancelTransactionFail({ error: error });
            }
        })
    );

    /**
     * getScreen
     */
    @Effect()
    public getScreen = this.actions.pipe(
        ofType(purchaseAction.getScreen),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerinoService.getServices();
                const searchResult = (await this.cinerinoService.place.searchScreeningRooms(payload)).data;
                return purchaseAction.getScreenSuccess({ screen: searchResult[0] });
            } catch (error) {
                return purchaseAction.getScreenFail({ error: error });
            }
        })
    );

    /**
     * GetScreeningEvent
     */
    @Effect()
    public getScreeningEvent = this.actions.pipe(
        ofType(purchaseAction.getScreeningEvent),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerinoService.getServices();
                const screeningEvent =
                    await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>({ id: payload.screeningEvent.id });
                const searchMovie = (await this.cinerinoService.creativeWork.searchMovies({
                    identifier: (screeningEvent.workPerformed === undefined)
                        ? undefined : screeningEvent.workPerformed.identifier
                })).data[0];
                if (screeningEvent.workPerformed !== undefined) {
                    screeningEvent.workPerformed.additionalProperty = searchMovie.additionalProperty;
                }
                return purchaseAction.getScreeningEventSuccess({ screeningEvent });
            } catch (error) {
                return purchaseAction.getScreeningEventFail({ error: error });
            }
        })
    );

    /**
     * temporaryReservation
     */
    @Effect()
    public temporaryReservation = this.actions.pipe(
        ofType(purchaseAction.temporaryReservation),
        map(action => action),
        mergeMap(async (payload) => {
            const transaction = payload.transaction;
            const screeningEvent = payload.screeningEvent;
            const reservations = payload.reservations;
            const screeningEventSeats = payload.screeningEventSeats;
            const additionalTicketText = payload.additionalTicketText;
            try {
                await this.cinerinoService.getServices();
                if (payload.authorizeSeatReservation !== undefined) {
                    await this.cinerinoService.transaction.placeOrder.voidSeatReservation(payload.authorizeSeatReservation);
                }
                // サーバータイムを使用して販売期間判定
                const serverTime = await this.utilService.getServerTime();
                const nowDate = moment(serverTime.date).toDate();
                if (screeningEvent.offers === undefined) {
                    throw new Error('screeningEvent.offers undefined');
                }
                if (screeningEvent.offers.validFrom > nowDate
                    || screeningEvent.offers.validThrough < nowDate) {
                    throw new Error('Outside sales period');
                }
                const availableSeats = Functions.Purchase.selectAvailableSeat({ reservations, screeningEventSeats });
                if (new Models.Purchase.Performance(screeningEvent).isTicketedSeat()
                    && availableSeats.length !== reservations.length) {
                    throw new Error('Out of stock').message;
                }
                const authorizeSeatReservation =
                    <factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>>
                    await this.cinerinoService.transaction.placeOrder.authorizeSeatReservation({
                        object: {
                            event: { id: screeningEvent.id },
                            acceptedOffer: reservations.map((r, index) => {
                                if (r.ticket === undefined || r.ticket.ticketOffer.id === undefined) {
                                    throw new Error('ticket or ticket.ticketOffer.id is undefined').message;
                                }
                                return {
                                    id: r.ticket.ticketOffer.id,
                                    addOn: (r.ticket.addOn === undefined)
                                        ? undefined
                                        : r.ticket.addOn.map(a => ({ id: a.id })),
                                    additionalProperty: [],
                                    itemOffered: {
                                        serviceOutput: {
                                            typeOf: factory.chevre.reservationType.EventReservation,
                                            additionalProperty: (screeningEvent.workPerformed === undefined
                                                || screeningEvent.workPerformed.additionalProperty === undefined)
                                                ? [] : [...screeningEvent.workPerformed.additionalProperty],
                                            additionalTicketText: additionalTicketText,
                                            reservedTicket: {
                                                typeOf: 'Ticket',
                                                ticketedSeat: (new Models.Purchase.Performance(screeningEvent).isTicketedSeat())
                                                    ? availableSeats[index] : undefined,
                                            },
                                            subReservation: (new Models.Purchase.Performance(screeningEvent).isTicketedSeat())
                                                ? availableSeats[index].subReservations.map(s => {
                                                    return {
                                                        reservedTicket: { typeOf: 'Ticket', ticketedSeat: s }
                                                    };
                                                })
                                                : undefined
                                        }
                                    }
                                };
                            })
                        },
                        purpose: transaction
                    });
                return purchaseAction.temporaryReservationSuccess({
                    addAuthorizeSeatReservation: authorizeSeatReservation,
                    removeAuthorizeSeatReservation: payload.authorizeSeatReservation
                });
            } catch (error) {
                return purchaseAction.temporaryReservationFail({ error: error });
            }
        })
    );

    /**
     * cancelTemporaryReservation
     */
    @Effect()
    public cancelTemporaryReservation = this.actions.pipe(
        ofType(purchaseAction.cancelTemporaryReservations),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const authorizeSeatReservations = payload.authorizeSeatReservations;
                await this.cinerinoService.getServices();
                for (const authorizeSeatReservation of authorizeSeatReservations) {
                    await this.cinerinoService.transaction.placeOrder.voidSeatReservation(authorizeSeatReservation);
                }

                return purchaseAction.cancelTemporaryReservationsSuccess({ authorizeSeatReservations });
            } catch (error) {
                return purchaseAction.cancelTemporaryReservationsFail({ error: error });
            }
        })
    );

    /**
     * getTicketList
     */
    @Effect()
    public getTicketList = this.actions.pipe(
        ofType(purchaseAction.getTicketList),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const seller = payload.seller;
                if (seller.id === undefined
                    || this.cinerinoService.auth.options.clientId === undefined) {
                    throw new Error('seller.id or auth.options.clientId undefined');
                }
                await this.cinerinoService.getServices();
                const screeningEventTicketOffers = await this.cinerinoService.event.searchTicketOffers({
                    event: { id: payload.screeningEvent.id },
                    seller: {
                        typeOf: seller.typeOf,
                        id: seller.id
                    },
                    store: { id: this.cinerinoService.auth.options.clientId }
                });

                return purchaseAction.getTicketListSuccess({ screeningEventTicketOffers });
            } catch (error) {
                return purchaseAction.getTicketListFail({ error: error });
            }
        })
    );

    /**
     * registerContact
     */
    @Effect()
    public registerContact = this.actions.pipe(
        ofType(purchaseAction.registerContact),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const transaction = payload.transaction;
                const profile = payload.profile;
                await this.cinerinoService.getServices();
                await this.cinerinoService.transaction.placeOrder.setProfile({
                    id: transaction.id,
                    agent: {
                        ...profile,
                        telephone: (profile.telephone === undefined)
                            ? undefined
                            : Functions.Util.formatTelephone(profile.telephone)
                    }
                });

                return purchaseAction.registerContactSuccess({ profile });
            } catch (error) {
                return purchaseAction.registerContactFail({ error: error });
            }
        })
    );

    /**
     * authorizeCreditCard
     */
    @Effect()
    public authorizeCreditCard = this.actions.pipe(
        ofType(purchaseAction.authorizeCreditCard),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const creditCard = payload.creditCard;
                const amount = payload.amount;
                await this.cinerinoService.getServices();
                if (payload.authorizeCreditCardPayment !== undefined) {
                    await this.cinerinoService.payment.voidTransaction(payload.authorizeCreditCardPayment);
                }
                const transaction = payload.transaction;
                const authorizeCreditCardPaymentResult =
                    await this.cinerinoService.payment.authorizeCreditCard({
                        object: {
                            typeOf: factory.paymentMethodType.CreditCard,
                            amount,
                            method: <any>'1',
                            creditCard
                        },
                        purpose: transaction
                    });

                return purchaseAction.authorizeCreditCardSuccess({ authorizeCreditCardPayment: authorizeCreditCardPaymentResult });
            } catch (error) {
                return purchaseAction.authorizeCreditCardFail({ error: error });
            }
        })
    );

    /**
     * createGmoTokenObject
     */
    @Effect()
    public createGmoTokenObject = this.actions.pipe(
        ofType(purchaseAction.createGmoTokenObject),
        map(action => action),
        mergeMap(async (payload) => {
            const creditCard = payload.creditCard;
            const seller = payload.seller;
            try {
                const gmoTokenObject = await Functions.Purchase.createGmoTokenObject({ creditCard, seller, });

                return purchaseAction.createGmoTokenObjectSuccess({ gmoTokenObject });
            } catch (error) {
                return purchaseAction.createGmoTokenObjectFail({ error: error });
            }
        })
    );

    /**
     * authorizeMovieTicket
     */
    @Effect()
    public authorizeMovieTicket = this.actions.pipe(
        ofType(purchaseAction.authorizeMovieTicket),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerinoService.getServices();
                if (payload.authorizeMovieTicketPayments.length > 0) {
                    for (const authorizeMovieTicketPayment of payload.authorizeMovieTicketPayments) {
                        await this.cinerinoService.payment.voidTransaction(authorizeMovieTicketPayment);
                    }
                }
                const transaction = payload.transaction;
                const pendingMovieTickets = payload.pendingMovieTickets;
                const authorizeSeatReservations = payload.authorizeSeatReservations;
                const authorizeMovieTicketPayments: factory.action.authorize.paymentMethod.movieTicket.IAction[] = [];
                const seller = payload.seller;
                for (const authorizeSeatReservation of authorizeSeatReservations) {
                    const movieTickets = Functions.Purchase.createMovieTicketsFromAuthorizeSeatReservation({
                        authorizeSeatReservation, pendingMovieTickets, seller
                    });
                    const movieTicketIdentifiers: {
                        identifier: string;
                        movieTickets: factory.chevre.paymentMethod.paymentCard.movieTicket.IMovieTicket[]
                    }[] = [];
                    movieTickets.forEach((movieTicket) => {
                        const findResult = movieTicketIdentifiers.find((movieTicketIdentifier) => {
                            return (movieTicketIdentifier.identifier === movieTicket.identifier);
                        });
                        if (findResult === undefined) {
                            movieTicketIdentifiers.push({
                                identifier: movieTicket.identifier, movieTickets: [movieTicket]
                            });
                            return;
                        }
                        findResult.movieTickets.push(movieTicket);
                    });
                    for (const movieTicketIdentifier of movieTicketIdentifiers) {
                        const authorizeMovieTicketPaymentResult = await this.cinerinoService.payment.authorizeMovieTicket({
                            object: {
                                typeOf: factory.paymentMethodType.MovieTicket,
                                amount: 0,
                                movieTickets: movieTicketIdentifier.movieTickets
                            },
                            purpose: transaction
                        });
                        authorizeMovieTicketPayments.push(authorizeMovieTicketPaymentResult);
                    }
                }

                return purchaseAction.authorizeMovieTicketSuccess({ authorizeMovieTicketPayments });
            } catch (error) {
                return purchaseAction.authorizeMovieTicketFail({ error: error });
            }
        })
    );
    /**
     * checkMovieTicket
     */
    @Effect()
    public checkMovieTicket = this.actions.pipe(
        ofType(purchaseAction.checkMovieTicket),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                await this.cinerinoService.getServices();
                const transaction = payload.transaction;
                const screeningEvent = payload.screeningEvent;
                const movieTickets = payload.movieTickets;
                if (transaction.seller.id === undefined) {
                    throw new Error('transaction.seller.id undefined');
                }
                const checkMovieTicketAction = await this.cinerinoService.payment.checkMovieTicket({
                    typeOf: factory.paymentMethodType.MovieTicket,
                    movieTickets: movieTickets.map((movieTicket) => {
                        return {
                            ...movieTicket,
                            project: screeningEvent.project,
                            serviceType: '', // 情報空でよし
                            serviceOutput: {
                                reservationFor: {
                                    typeOf: screeningEvent.typeOf,
                                    id: screeningEvent.id
                                },
                                reservedTicket: {
                                    ticketedSeat: {
                                        typeOf: factory.chevre.placeType.Seat,
                                        seatingType: <any>'', // 情報空でよし
                                        seatNumber: '', // 情報空でよし
                                        seatRow: '', // 情報空でよし
                                        seatSection: '' // 情報空でよし
                                    }
                                }
                            }
                        };
                    }),
                    seller: {
                        typeOf: transaction.seller.typeOf,
                        id: transaction.seller.id
                    }
                });

                return purchaseAction.checkMovieTicketSuccess({ checkMovieTicketAction });
            } catch (error) {
                return purchaseAction.checkMovieTicketFail({ error: error });
            }
        })
    );

    /**
     * EndTransaction
     */
    @Effect()
    public endTransaction = this.actions.pipe(
        ofType(purchaseAction.endTransaction),
        map(action => action),
        mergeMap(async (payload) => {
            const environment = getEnvironment();
            const transaction = payload.transaction;
            const authorizeSeatReservations = Functions.Purchase.authorizeSeatReservation2Event({
                authorizeSeatReservations: payload.authorizeSeatReservations
            });
            const seller = payload.seller;
            const linyId = payload.linyId;
            try {
                await this.cinerinoService.getServices();
                const params: factory.transaction.placeOrder.IConfirmParams & {
                    sendEmailMessage?: boolean;
                    email?: factory.creativeWork.message.email.ICustomization;
                } = {
                    id: transaction.id,
                    sendEmailMessage: true,
                    email: {
                        sender: {
                            name: (this.translate.instant('email.purchase.complete.sender.name') === '')
                                ? authorizeSeatReservations[0].event.superEvent.location.name?.ja
                                : this.translate.instant('email.purchase.complete.sender.name'),
                            email: (this.translate.instant('email.purchase.complete.sender.email') === '')
                                ? undefined : this.translate.instant('email.purchase.complete.sender.email')
                        },
                        toRecipient: {
                            name: (this.translate.instant('email.purchase.complete.toRecipient.name') === '')
                                ? undefined : this.translate.instant('email.purchase.complete.toRecipient.name'),
                            email: (this.translate.instant('email.purchase.complete.toRecipient.email') === '')
                                ? undefined : this.translate.instant('email.purchase.complete.toRecipient.email')
                        },
                        about: (this.translate.instant('email.purchase.complete.about') === '')
                            ? undefined : this.translate.instant('email.purchase.complete.about'),
                        template: undefined
                    }
                };
                if (environment.PURCHASE_COMPLETE_MAIL_CUSTOM && params.email !== undefined) {
                    // 完了メールをカスタマイズ
                    const path = `/ejs/mail/complete/${payload.language}.ejs`;
                    const url = (await Functions.Util.isFile(`${Functions.Util.getProject().storageUrl}${path}`))
                        ? `${Functions.Util.getProject().storageUrl}${path}`
                        : `/default${path}`;
                    const view = await this.utilService.getText(url);
                    params.email.template = (<any>window).ejs.render(view, {
                        authorizeSeatReservations,
                        seller,
                        moment,
                        formatTelephone: Functions.Util.formatTelephone,
                        getItemPrice: Functions.Purchase.getItemPrice,
                        getTicketPrice: Functions.Purchase.getTicketPrice,
                        projectId: Functions.Util.getProject().projectId
                    });
                }
                const result = await this.cinerinoService.transaction.placeOrder.confirm(params);
                const order = result.order;
                if (environment.ANALYTICS_ID !== '') {
                    // アナリティクス連携
                    try {
                        if (order.acceptedOffers[0].itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                            throw new Error('reservationType is not EventReservation');
                        }
                        const itemOffered = <factory.chevre.reservation.IReservation<
                            factory.chevre.reservationType.EventReservation
                        >>order.acceptedOffers[0].itemOffered;
                        const sendData = {
                            hitType: 'event',
                            eventCategory: 'purchase',
                            eventAction: 'complete',
                            eventLabel: (itemOffered.typeOf === factory.chevre.reservationType.EventReservation)
                                ? `conversion-${itemOffered.reservationFor.superEvent.location.branchCode}` : 'conversion'
                        };
                        ga('send', sendData);
                    } catch (error) {
                        console.error(error);
                    }
                }

                if (linyId !== undefined) {
                    // liny連携
                    try {
                        const view = await this.utilService.getText(`${Functions.Util.getProject().storageUrl}/ejs/liny/complete/${payload.language}.ejs`);
                        const template = (<any>window).ejs.render(view, {
                            authorizeSeatReservations,
                            seller,
                            order,
                            moment,
                            formatTelephone: Functions.Util.formatTelephone,
                            getItemPrice: Functions.Purchase.getItemPrice
                        });
                        await this.linyService.sendMessage({ uid: linyId, message: template });
                    } catch (error) {
                        console.error(error);
                    }
                }

                return purchaseAction.endTransactionSuccess({ order });
            } catch (error) {
                await this.cinerinoService.transaction.placeOrder.cancel({
                    id: transaction.id
                });
                return purchaseAction.endTransactionFail({ error: error });
            }
        })
    );

    /**
     * ConvertExternalToPurchase
     */
    @Effect()
    public convertExternalToPurchase = this.actions.pipe(
        ofType(purchaseAction.convertExternalToPurchase),
        map(action => action),
        mergeMap(async (payload) => {
            const eventId = payload.eventId;
            try {
                await this.cinerinoService.getServices();
                const screeningEvent = await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>({ id: eventId });
                if (screeningEvent.offers === undefined
                    || screeningEvent.offers.seller === undefined
                    || screeningEvent.offers.seller.id === undefined) {
                    throw new Error('screeningEvent.offers.seller.id undefined');
                }
                const searchResult = await this.cinerinoService.place.searchMovieTheaters({
                    id: { $eq: screeningEvent.superEvent.location.id }
                });
                if (searchResult.data.length === 0) {
                    throw new Error('searchMovieTheaters notfound');
                }
                const theater = searchResult.data[0];
                const seller = await this.cinerinoService.seller.findById({ id: screeningEvent.offers.seller.id });
                return purchaseAction.convertExternalToPurchaseSuccess({ screeningEvent, seller, theater });
            } catch (error) {
                return purchaseAction.convertExternalToPurchaseFail({ error: error });
            }
        })
    );
}
