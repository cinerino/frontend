import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../..';
import { getEnvironment } from '../../../../environments/environment';
import { purchaseAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';
import { CinerinoService } from '../../cinerino.service';
import { LinyService } from '../../liny.service';
import { UtilService } from '../../util.service';
import { ActionStoreService } from '../store.service';

@Injectable({
    providedIn: 'root',
})
export class ActionTransactionService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService,
        private storeService: ActionStoreService,
        private translateService: TranslateService,
        private linyService: LinyService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 取引開始
     */
    public async start() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.StartTransaction',
            });
            const environment = getEnvironment();
            const { seller } = await this.storeService.getPurchaseData();
            if (seller === undefined || seller.id === undefined) {
                throw new Error('seller or seller.id undefined');
            }
            const now = (await this.utilService.getServerTime()).date;
            const agent = {
                identifier: [
                    ...environment.PURCHASE_TRANSACTION_IDENTIFIER,
                    {
                        name: 'userAgent',
                        value:
                            navigator && navigator.userAgent !== undefined
                                ? navigator.userAgent
                                : '',
                    },
                    {
                        name: 'appVersion',
                        value:
                            navigator && navigator.appVersion !== undefined
                                ? navigator.appVersion
                                : '',
                    },
                ],
            };
            const external = Functions.Util.getExternalData();
            const linyId =
                external.linyId === undefined ? undefined : external.linyId;
            if (linyId !== undefined) {
                agent.identifier.push({ name: 'linyId', value: linyId });
            }
            await this.cinerinoService.getServices();
            const passport = await this.cinerinoService.getPassport({
                scope: `Transaction:PlaceOrder:${seller.id}`,
            });
            const transaction =
                await this.cinerinoService.transaction.placeOrder.start({
                    expires: moment(now)
                        .add(environment.PURCHASE_TRANSACTION_TIME, 'minutes')
                        .toDate(),
                    seller: {
                        typeOf: seller.typeOf,
                        id: seller.id,
                    },
                    object: { passport },
                    agent,
                });
            this.store.dispatch(purchaseAction.setTransaction({ transaction }));
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 取引中止
     */
    public async cancel() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.CancelTransaction',
            });
            const { transaction } = await this.storeService.getPurchaseData();
            if (transaction === undefined) {
                this.utilService.loadEnd();
                return;
            }
            await this.cinerinoService.transaction.placeOrder.cancel({
                id: transaction.id,
            });
            this.store.dispatch(purchaseAction.cancelTransaction());
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 取引確定
     */
    public async confirm(params: {
        mailType: 'seatReservation' | 'product';
        language: string;
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.ConfirmTransaction',
            });
            const environment = getEnvironment();
            const { language, mailType } = params;
            const {
                transaction,
                authorizeSeatReservations,
                authorizeProducts,
                seller,
                theater,
            } = await this.storeService.getPurchaseData();
            if (transaction === undefined || seller === undefined) {
                throw new Error('transaction or seller undefined');
            }
            const external = Functions.Util.getExternalData();
            const linyId =
                external.linyId === undefined ? undefined : external.linyId;
            const authorizeEventSeatReservations =
                Functions.Purchase.authorizeSeatReservation2Event({
                    authorizeSeatReservations,
                });
            await this.cinerinoService.getServices();

            const email = {
                ...this.createCompleteMailHeader({ theater, language, seller }),
                template: undefined,
            };
            if (environment.PURCHASE_COMPLETE_MAIL_CUSTOM) {
                // 完了メールをカスタマイズ
                const path =
                    mailType === 'seatReservation'
                        ? `/ejs/mail/complete/${language}.ejs`
                        : `/ejs/mail/product/${language}.ejs`;
                const url = (await Functions.Util.isFile(
                    `${Functions.Util.getProject().storageUrl}${path}`
                ))
                    ? `${Functions.Util.getProject().storageUrl}${path}`
                    : `/default${path}`;
                const view = await this.utilService.getText(url);
                email.template = await (<any>window).ejs.render(
                    view,
                    {
                        authorizeSeatReservations:
                            authorizeEventSeatReservations,
                        authorizeProducts,
                        seller,
                        theater,
                        moment,
                        formatTelephone: Functions.Util.formatTelephone,
                        getItemPrice: Functions.Purchase.getItemPrice,
                        getTicketPrice: Functions.Purchase.getTicketPrice,
                        projectId: Functions.Util.getProject().projectId,
                    },
                    { async: true }
                );
            }
            const result =
                await this.cinerinoService.transaction.placeOrder.confirm({
                    id: transaction.id,
                    sendEmailMessage: true,
                    email,
                });
            const order = result.order;

            if (linyId !== undefined) {
                await this.sendMessageLiny({
                    language,
                    seller,
                    authorizeSeatReservations,
                    order,
                    linyId,
                });
            }

            this.store.dispatch(purchaseAction.setOrder({ order }));
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * Liny連携
     */
    private async sendMessageLiny(params: {
        language: string;
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
        seller: factory.seller.ISeller;
        order: factory.order.IOrder;
        linyId: string;
    }) {
        // liny連携
        try {
            const {
                language,
                authorizeSeatReservations,
                seller,
                order,
                linyId,
            } = params;
            const authorizeEventSeatReservations =
                Functions.Purchase.authorizeSeatReservation2Event({
                    authorizeSeatReservations,
                });
            const view = await this.utilService.getText(
                `${
                    Functions.Util.getProject().storageUrl
                }/ejs/liny/complete/${language}.ejs`
            );
            const template = await (<any>window).ejs.render(
                view,
                {
                    authorizeSeatReservations: authorizeEventSeatReservations,
                    seller,
                    order,
                    moment,
                    formatTelephone: Functions.Util.formatTelephone,
                    getItemPrice: Functions.Purchase.getItemPrice,
                },
                { async: true }
            );
            await this.linyService.sendMessage({
                uid: linyId,
                message: template,
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 完了メールヘッダー生成
     */
    private createCompleteMailHeader(params: {
        seller: factory.chevre.seller.ISeller;
        theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        language?: string;
    }) {
        const { theater, seller } = params;
        return {
            sender: {
                name:
                    this.translateService.instant(
                        'email.purchase.complete.sender.name'
                    ) === ''
                        ? theater === undefined
                            ? typeof seller.name === 'string'
                                ? seller.name
                                : seller.name?.ja
                            : theater.name.ja
                        : this.translateService.instant(
                              'email.purchase.complete.sender.name'
                          ),
                email:
                    this.translateService.instant(
                        'email.purchase.complete.sender.email'
                    ) === ''
                        ? undefined
                        : this.translateService.instant(
                              'email.purchase.complete.sender.email'
                          ),
            },
            toRecipient: {
                name:
                    this.translateService.instant(
                        'email.purchase.complete.toRecipient.name'
                    ) === ''
                        ? undefined
                        : this.translateService.instant(
                              'email.purchase.complete.toRecipient.name'
                          ),
                email:
                    this.translateService.instant(
                        'email.purchase.complete.toRecipient.email'
                    ) === ''
                        ? undefined
                        : this.translateService.instant(
                              'email.purchase.complete.toRecipient.email'
                          ),
            },
            about:
                this.translateService.instant(
                    'email.purchase.complete.about'
                ) === ''
                    ? undefined
                    : this.translateService.instant(
                          'email.purchase.complete.about'
                      ),
        };
    }

    /**
     * プロフィール登録
     */
    public async setProfile(profile: factory.person.IProfile) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.SetProfile',
            });
            const { transaction } = await this.storeService.getPurchaseData();
            if (transaction === undefined) {
                throw new Error('transaction undefined');
            }
            await this.cinerinoService.getServices();
            await this.cinerinoService.transaction.placeOrder.setProfile({
                id: transaction.id,
                agent: {
                    ...profile,
                    telephone:
                        profile.telephone === undefined
                            ? undefined
                            : Functions.Util.formatTelephone(profile.telephone),
                },
            });
            this.store.dispatch(purchaseAction.setProfile({ profile }));
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 座席仮予約
     */
    public async authorizeSeatReservation(params: {
        reservations: Models.Purchase.Reservation.IReservation[];
        additionalTicketText?: string;
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.AuthorizeSeatReservation',
            });
            const { additionalTicketText, screeningEventSeats } = params;
            const {
                transaction,
                authorizeSeatReservation,
                screeningEvent,
                screeningEventTicketOffers,
                checkMemberships,
            } = await this.storeService.getPurchaseData();
            const reservations = params.reservations.map((r) => {
                return {
                    seat: r.seat,
                    ticket:
                        r.ticket === undefined
                            ? {
                                  ticketOffer: screeningEventTicketOffers[0],
                              }
                            : r.ticket,
                };
            });
            if (transaction === undefined || screeningEvent === undefined) {
                throw new Error('transaction or screeningEvent undefined');
            }
            await this.cinerinoService.getServices();
            if (authorizeSeatReservation !== undefined) {
                await this.cinerinoService.transaction.placeOrder.voidSeatReservation(
                    authorizeSeatReservation
                );
            }
            // サーバータイムを使用して販売期間判定
            const serverTime = await this.utilService.getServerTime();
            const nowDate = moment(serverTime.date).toDate();
            if (screeningEvent.offers === undefined) {
                throw new Error('screeningEvent.offers undefined');
            }
            if (
                screeningEvent.offers.validFrom > nowDate ||
                screeningEvent.offers.validThrough < nowDate
            ) {
                throw new Error('Outside sales period');
            }
            const availableSeats = Functions.Purchase.selectAvailableSeat({
                reservations,
                screeningEventSeats,
            });
            const isTicketedSeat = new Models.Purchase.Performance({
                screeningEvent,
            }).isTicketedSeat();
            if (
                isTicketedSeat &&
                availableSeats.length !== reservations.length
            ) {
                throw new Error('Out of stock');
            }
            const authorizeResult =
                await this.cinerinoService.transaction.placeOrder.authorizeSeatReservation(
                    {
                        object: {
                            reservationFor: { id: screeningEvent.id },
                            acceptedOffer: reservations.map((r, index) => {
                                if (
                                    r.ticket === undefined ||
                                    r.ticket.ticketOffer.id === undefined
                                ) {
                                    throw new Error(
                                        'ticket or ticket.ticketOffer.id is undefined'
                                    );
                                }

                                return {
                                    id: r.ticket.ticketOffer.id,
                                    addOn:
                                        r.ticket.addOn === undefined
                                            ? undefined
                                            : r.ticket.addOn.map((a) => ({
                                                  id: a.id,
                                              })),
                                    additionalProperty: [],
                                    itemOffered: {
                                        serviceOutput: {
                                            typeOf: factory.chevre
                                                .reservationType
                                                .EventReservation,
                                            additionalProperty:
                                                screeningEvent.workPerformed ===
                                                    undefined ||
                                                screeningEvent.workPerformed
                                                    .additionalProperty ===
                                                    undefined
                                                    ? []
                                                    : [
                                                          ...screeningEvent.workPerformed.additionalProperty.filter(
                                                              (a) =>
                                                                  a.value !== ''
                                                          ),
                                                      ],
                                            additionalTicketText:
                                                additionalTicketText,
                                            reservedTicket: {
                                                typeOf: 'Ticket',
                                                ticketedSeat: isTicketedSeat
                                                    ? availableSeats[index]
                                                    : undefined,
                                            },
                                            subReservation: isTicketedSeat
                                                ? availableSeats[
                                                      index
                                                  ].subReservations.map(
                                                      (ticketedSeat) => ({
                                                          reservedTicket: {
                                                              typeOf: 'Ticket',
                                                              ticketedSeat,
                                                          },
                                                      })
                                                  )
                                                : undefined,
                                            programMembershipUsed:
                                                Array.isArray(
                                                    r.ticket.ticketOffer
                                                        .eligibleMembershipType
                                                )
                                                    ? {
                                                          identifier:
                                                              checkMemberships[0]
                                                                  .identifier,
                                                          accessCode:
                                                              checkMemberships[0]
                                                                  .accessCode,
                                                      }
                                                    : undefined,
                                        },
                                    },
                                };
                            }),
                        },
                        purpose: transaction,
                    }
                );
            this.store.dispatch(
                purchaseAction.setAuthorizeSeatReservation({
                    addAuthorizeSeatReservation: authorizeResult,
                    removeAuthorizeSeatReservation: authorizeSeatReservation,
                })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 座席仮予約解除
     */
    public async voidSeatReservation(params: {
        authorizeSeatReservations: factory.action.authorize.offer.seatReservation.IAction<factory.service.webAPI.Identifier.Chevre>[];
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.VoidSeatReservation',
            });
            const { authorizeSeatReservations } = params;
            await this.cinerinoService.getServices();
            for (const authorizeSeatReservation of authorizeSeatReservations) {
                await this.cinerinoService.transaction.placeOrder.voidSeatReservation(
                    authorizeSeatReservation
                );
            }

            this.store.dispatch(
                purchaseAction.voidSeatReservation({
                    authorizeSeatReservations,
                })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
