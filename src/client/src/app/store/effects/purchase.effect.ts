import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { IScreen } from '../../models';
import { CinerinoService } from '../../services/cinerino.service';
import * as purchase from '../actions/purchase.action';
import { createGmoTokenObject, createOrderId, formatTelephone } from '../functions';
/**
 * Purchase Effects
 */
@Injectable()
export class PurchaseEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService,
        private http: HttpClient
    ) { }

    /**
     * GetTheaters
     */
    @Effect()
    public getTheaters = this.actions.pipe(
        ofType<purchase.GetTheaters>(purchase.ActionTypes.GetTheaters),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const movieTheaters = await this.cinerino.organization.searchMovieTheaters(payload.params);
                return new purchase.GetTheatersSuccess({ movieTheaters });
            } catch (error) {
                return new purchase.GetTheatersFail({ error: error });
            }
        })
    );

    /**
     * GetSchedule
     */
    @Effect()
    public getSchedule = this.actions.pipe(
        ofType<purchase.GetSchedule>(purchase.ActionTypes.GetSchedule),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const screeningEvents = await this.cinerino.event.searchScreeningEvents(payload.params);
                return new purchase.GetScheduleSuccess({ screeningEvents });
            } catch (error) {
                return new purchase.GetScheduleFail({ error: error });
            }
        })
    );

    /**
     * StartTransaction
     */
    @Effect()
    public startTransaction = this.actions.pipe(
        ofType<purchase.StartTransaction>(purchase.ActionTypes.StartTransaction),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const transaction = await this.cinerino.transaction.placeOrder.start(payload.params);
                return new purchase.StartTransactionSuccess({ transaction });
            } catch (error) {
                return new purchase.StartTransactionFail({ error: error });
            }
        })
    );

    /**
     * getScreen
     */
    @Effect()
    public getScreen = this.actions.pipe(
        ofType<purchase.GetScreen>(purchase.ActionTypes.GetScreen),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const screeningEventOffers = await this.cinerino.event.searchScreeningEventOffers({
                    eventId: payload.screeningEvent.id
                });
                const theaterCode = payload.screeningEvent.superEvent.location.branchCode;
                const screenCode = `000${payload.screeningEvent.location.branchCode}`.slice(-3);
                const screen = await this.http.get<IScreen>(`/json/theater/${theaterCode}/${screenCode}.json`).toPromise();
                const setting = await this.http.get<IScreen>('/json/theater/setting.json').toPromise();
                const screenData = Object.assign(setting, screen);
                return new purchase.GetScreenSuccess({ screeningEventOffers, screenData });
            } catch (error) {
                return new purchase.GetScreenFail({ error: error });
            }
        })
    );

    /**
     * temporaryReservation
     */
    @Effect()
    public temporaryReservation = this.actions.pipe(
        ofType<purchase.TemporaryReservation>(purchase.ActionTypes.TemporaryReservation),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                if (payload.authorizeSeatReservation !== undefined) {
                    await this.cinerino.transaction.placeOrder.voidSeatReservation({
                        transactionId: payload.transaction.id,
                        actionId: payload.authorizeSeatReservation.id
                    });
                }
                const authorizeSeatReservation = await this.cinerino.transaction.placeOrder.authorizeSeatReservation({
                    transactionId: payload.transaction.id,
                    event: {
                        id: payload.screeningEvent.id
                    },
                    tickets: payload.reservations.map((reservation) => {
                        if (reservation.ticket === undefined) {
                            throw new Error('ticket is undefined');
                        }
                        return {
                            ticketType: {
                                id: reservation.ticket.id
                            },
                            ticketedSeat: <any>{
                                seatNumber: reservation.seat.seatNumber,
                                seatSection: reservation.seat.seatSection
                            }
                        };
                    }),
                    notes: ''
                });
                return new purchase.TemporaryReservationSuccess({ authorizeSeatReservation });
            } catch (error) {
                return new purchase.TemporaryReservationFail({ error: error });
            }
        })
    );

    /**
     * getTicketList
     */
    @Effect()
    public getTicketList = this.actions.pipe(
        ofType<purchase.GetTicketList>(purchase.ActionTypes.GetTicketList),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const screeningEventTicketTypes = await this.cinerino.event.searchScreeningEventTicketTypes({
                    eventId: payload.screeningEvent.id
                });

                return new purchase.GetTicketListSuccess({ screeningEventTicketTypes });
            } catch (error) {
                return new purchase.GetTicketListFail({ error: error });
            }
        })
    );

    /**
     * registerContact
     */
    @Effect()
    public registerContact = this.actions.pipe(
        ofType<purchase.RegisterContact>(purchase.ActionTypes.RegisterContact),
        map(action => action.payload),
        mergeMap(async (payload) => {
            const transaction = payload.transaction;
            const contact = payload.contact;
            contact.telephone = formatTelephone(contact.telephone);
            try {
                await this.cinerino.getServices();
                const customerContact =
                    await this.cinerino.transaction.placeOrder.setCustomerContact({
                        transactionId: transaction.id,
                        contact
                    });

                return new purchase.RegisterContactSuccess({ customerContact });
            } catch (error) {
                return new purchase.RegisterContactFail({ error: error });
            }
        })
    );

    /**
     * registerCreditCard
     */
    @Effect()
    public registerCreditCard = this.actions.pipe(
        ofType<purchase.RegisterCreditCard>(purchase.ActionTypes.RegisterCreditCard),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                if (payload.authorizeCreditCardPayment !== undefined) {
                    await this.cinerino.transaction.placeOrder.voidAccountPayment({
                        transactionId: payload.transaction.id,
                        actionId: payload.authorizeCreditCardPayment.id
                    });
                }
                const transaction = payload.transaction;
                const orderId = createOrderId({
                    orderCount: payload.orderCount,
                    authorizeSeatReservation: payload.authorizeSeatReservation,
                    movieTheater: payload.movieTheater
                });
                const amount = payload.amount;
                const method = payload.method;
                const gmoTokenObject = await createGmoTokenObject({
                    creditCard: payload.creditCard,
                    movieTheater: payload.movieTheater
                });
                const creditCard = { token: gmoTokenObject.token };
                const authorizeCreditCardPayment =
                    await this.cinerino.transaction.placeOrder.authorizeCreditCardPayment({
                        transactionId: transaction.id,
                        orderId,
                        amount,
                        method,
                        creditCard
                    });

                return new purchase.RegisterCreditCardSuccess({ authorizeCreditCardPayment, gmoTokenObject });
            } catch (error) {
                return new purchase.RegisterCreditCardFail({ error: error });
            }
        })
    );

    /**
     * reservation
     */
    @Effect()
    public reservation = this.actions.pipe(
        ofType<purchase.Reservation>(purchase.ActionTypes.Reservation),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const result = await this.cinerino.transaction.placeOrder.confirm({
                    transactionId: payload.transaction.id
                });
                return new purchase.ReservationSuccess({ result });
            } catch (error) {
                await this.cinerino.transaction.placeOrder.cancel({
                    transactionId: payload.transaction.id
                });
                return new purchase.ReservationFail({ error: error });
            }
        })
    );

    /**
     * getPurchaseHistory
     */
    @Effect()
    public getPurchaseHistory = this.actions.pipe(
        ofType<purchase.GetPurchaseHistory>(purchase.ActionTypes.GetPurchaseHistory),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = Object.assign({ personId: 'me' }, payload.params);
                await this.cinerino.getServices();
                const orders = await this.cinerino.person.searchOrders(params);
                return new purchase.GetPurchaseHistorySuccess({ result: orders });
            } catch (error) {
                return new purchase.GetPurchaseHistoryFail({ error: error });
            }
        })
    );

    /**
     * orderAuthorize
     */
    @Effect()
    public orderAuthorize = this.actions.pipe(
        ofType<purchase.OrderAuthorize>(purchase.ActionTypes.OrderAuthorize),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = Object.assign({ personId: 'me' }, payload.params);
                await this.cinerino.getServices();
                const order = await this.cinerino.order.authorizeOwnershipInfos(params);
                return new purchase.OrderAuthorizeSuccess({ order });
            } catch (error) {
                return new purchase.OrderAuthorizeFail({ error: error });
            }
        })
    );
}
