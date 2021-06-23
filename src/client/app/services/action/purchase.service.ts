import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
import { purchaseAction } from '../../store/actions';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { LinyService } from '../liny.service';
import { UtilService } from '../util.service';
import { ActionPaymentService } from './payment.service';

@Injectable({
    providedIn: 'root',
})
export class ActionPurchaseService {
    public purchase: Observable<reducers.IPurchaseState>;
    public error: Observable<string | null>;
    public environment = getEnvironment();

    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private cinerinoService: CinerinoService,
        public payment: ActionPaymentService,
        private translate: TranslateService,
        private linyService: LinyService
    ) {
        this.purchase = this.store.pipe(select(reducers.getPurchase));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 購入データ取得
     */
    public async getData() {
        return new Promise<reducers.IPurchaseState>((resolve) => {
            this.purchase
                .subscribe((purchase) => {
                    resolve(purchase);
                })
                .unsubscribe();
        });
    }

    /**
     * データ削除
     */
    public delete() {
        this.store.dispatch(purchaseAction.remove());
    }

    /**
     * 一時データ削除
     */
    public unsettledDelete() {
        this.store.dispatch(purchaseAction.unsettledDelete());
    }

    /**
     * スケジュール日選択
     */
    public selectScheduleDate(scheduleDate: string) {
        this.store.dispatch(
            purchaseAction.selectScheduleDate({ scheduleDate })
        );
    }

    /**
     * 販売者取得
     */
    public async getSeller(params: { id: string }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetSeller',
            });
            await this.cinerinoService.getServices();
            const { id } = params;
            const seller = await this.cinerinoService.seller.findById({ id });
            this.store.dispatch(purchaseAction.setSeller({ seller }));
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 劇場選択
     */
    public selectTheater(
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom
    ) {
        this.store.dispatch(purchaseAction.selectTheater({ theater }));
    }

    /**
     * 先行販売日取得
     */
    public async getPreScheduleDates() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetPreScheduleDates',
            });
            const external = Functions.Util.getExternalData();
            const { theater } = await this.getData();
            if (
                theater === undefined ||
                theater.offers === undefined ||
                theater.offers.availabilityStartsGraceTime === undefined ||
                theater.offers.availabilityStartsGraceTime.value ===
                    undefined ||
                theater.offers.availabilityStartsGraceTime.unitCode ===
                    undefined ||
                theater.offers.availabilityStartsGraceTime.unitCode ===
                    undefined
            ) {
                this.utilService.loadEnd();
                return [];
            }
            const { value, unitCode } =
                theater.offers.availabilityStartsGraceTime;
            const availabilityStartsGraceTime: {
                value: number;
                unit: 'day' | 'year' | 'second';
            } = {
                value: value * -1 + 1,
                unit:
                    unitCode === factory.chevre.unitCode.Day
                        ? 'day'
                        : unitCode === factory.chevre.unitCode.Ann
                        ? 'year'
                        : unitCode === factory.chevre.unitCode.Sec
                        ? 'second'
                        : 'second',
            };
            const superEvent = {
                ids:
                    external.superEventId === undefined
                        ? []
                        : [external.superEventId],
                locationBranchCodes:
                    theater.branchCode === undefined
                        ? []
                        : [theater.branchCode],
                workPerformedIdentifiers:
                    external.workPerformedId === undefined
                        ? []
                        : [external.workPerformedId],
            };
            await this.cinerinoService.getServices();
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const today = moment(moment().format('YYYYMMDD')).toDate();
            const limit = 100;
            let page = 1;
            let roop = true;
            let screeningEvents: factory.chevre.event.screeningEvent.IEvent[] =
                [];
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [
                        factory.chevre.eventStatusType.EventScheduled,
                    ],
                    superEvent: superEvent,
                    startFrom: moment(today, 'YYYYMMDD')
                        .add(
                            availabilityStartsGraceTime.value,
                            availabilityStartsGraceTime.unit
                        )
                        .toDate(),
                    offers: {
                        validFrom: now,
                        validThrough: now,
                        availableFrom: now,
                        availableThrough: now,
                    },
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
                const date = moment(screeningEvent.startDate).format(
                    'YYYYMMDD'
                );
                const findResult = sheduleDates.find((s) => s === date);
                if (findResult === undefined) {
                    sheduleDates.push(date);
                }
            });
            this.utilService.loadEnd();
            return sheduleDates;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * イベント取得
     */
    public async getScreeningEvent(params: { id: string }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningEvent',
            });
            const { id } = params;
            await this.cinerinoService.getServices();
            const screeningEvent =
                await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>(
                    { id }
                );
            const workPerformed = (
                await this.cinerinoService.creativeWork.searchMovies({
                    identifier:
                        screeningEvent.workPerformed === undefined
                            ? undefined
                            : screeningEvent.workPerformed.identifier,
                })
            ).data[0];
            if (
                workPerformed !== undefined &&
                screeningEvent.workPerformed !== undefined
            ) {
                screeningEvent.workPerformed.additionalProperty =
                    workPerformed.additionalProperty;
            }
            this.store.dispatch(
                purchaseAction.setScreeningEvent({ screeningEvent })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 取引開始
     */
    public async startTransaction() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.StartTransaction',
            });
            const environment = getEnvironment();
            const { seller } = await this.getData();
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
                        .add(
                            this.environment.PURCHASE_TRANSACTION_TIME,
                            'minutes'
                        )
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
    public async cancelTransaction() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.CancelTransaction',
            });
            const { transaction } = await this.getData();
            if (transaction === undefined) {
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
    public async confirmTransaction(params: { language: string }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.SetProfile',
            });
            const environment = getEnvironment();
            const { language } = params;
            const { transaction, authorizeSeatReservations, seller, theater } =
                await this.getData();
            if (
                transaction === undefined ||
                seller === undefined ||
                theater === undefined
            ) {
                throw new Error('transaction or seller or theater undefined');
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
                ...this.createCompleteMailHeader({ theater, language }),
                template: undefined,
            };
            if (environment.PURCHASE_COMPLETE_MAIL_CUSTOM) {
                // 完了メールをカスタマイズ
                const path = `/ejs/mail/complete/${language}.ejs`;
                const url = (await Functions.Util.isFile(
                    `${Functions.Util.getProject().storageUrl}${path}`
                ))
                    ? `${Functions.Util.getProject().storageUrl}${path}`
                    : `/default${path}`;
                const view = await this.utilService.getText(url);
                email.template = (<any>window).ejs.render(view, {
                    authorizeSeatReservations: authorizeEventSeatReservations,
                    seller,
                    theater,
                    moment,
                    formatTelephone: Functions.Util.formatTelephone,
                    getItemPrice: Functions.Purchase.getItemPrice,
                    getTicketPrice: Functions.Purchase.getTicketPrice,
                    projectId: Functions.Util.getProject().projectId,
                });
            }
            const result =
                await this.cinerinoService.transaction.placeOrder.confirm({
                    id: transaction.id,
                    sendEmailMessage: true,
                    email,
                });
            const order = result.order;

            if (linyId !== undefined) {
                // liny連携
                try {
                    const view = await this.utilService.getText(
                        `${
                            Functions.Util.getProject().storageUrl
                        }/ejs/liny/complete/${language}.ejs`
                    );
                    const template = (<any>window).ejs.render(view, {
                        authorizeSeatReservations:
                            authorizeEventSeatReservations,
                        seller,
                        order,
                        moment,
                        formatTelephone: Functions.Util.formatTelephone,
                        getItemPrice: Functions.Purchase.getItemPrice,
                    });
                    await this.linyService.sendMessage({
                        uid: linyId,
                        message: template,
                    });
                } catch (error) {
                    console.error(error);
                }
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
     * 完了メールヘッダー生成
     */
    private createCompleteMailHeader(params: {
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        language: string;
    }) {
        return {
            sender: {
                name:
                    this.translate.instant(
                        'email.purchase.complete.sender.name'
                    ) === ''
                        ? params.theater.name.ja
                        : this.translate.instant(
                              'email.purchase.complete.sender.name'
                          ),
                email:
                    this.translate.instant(
                        'email.purchase.complete.sender.email'
                    ) === ''
                        ? undefined
                        : this.translate.instant(
                              'email.purchase.complete.sender.email'
                          ),
            },
            toRecipient: {
                name:
                    this.translate.instant(
                        'email.purchase.complete.toRecipient.name'
                    ) === ''
                        ? undefined
                        : this.translate.instant(
                              'email.purchase.complete.toRecipient.name'
                          ),
                email:
                    this.translate.instant(
                        'email.purchase.complete.toRecipient.email'
                    ) === ''
                        ? undefined
                        : this.translate.instant(
                              'email.purchase.complete.toRecipient.email'
                          ),
            },
            about:
                this.translate.instant('email.purchase.complete.about') === ''
                    ? undefined
                    : this.translate.instant('email.purchase.complete.about'),
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
            const { transaction } = await this.getData();
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
     * スクリーン取得
     */
    public async getScreeningRoom(params: {
        limit?: number;
        page?: number;
        branchCode?: {
            $eq?: string;
        };
        containedInPlace?: {
            branchCode?: {
                $eq?: string;
            };
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningRoom',
            });
            await this.cinerinoService.getServices();
            const searchResult = (
                await this.cinerinoService.place.searchScreeningRooms(params)
            ).data;
            this.store.dispatch(
                purchaseAction.setScreeningRoom({
                    screeningRoom: searchResult[0],
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
     * 空席情報取得
     */
    public async getScreeningEventSeats() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.GetScreeningEventSeats',
            });
            const { screeningEvent } = await this.getData();
            if (screeningEvent === undefined) {
                throw new Error('purchase.screeningEvent === undefined');
            }
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
            if (
                !new Models.Purchase.Performance({
                    screeningEvent,
                }).isTicketedSeat()
            ) {
                this.utilService.loadEnd();
                return result;
            }
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.event.searchSeats({
                        event: { id: screeningEvent.id },
                        page,
                        limit,
                    });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            this.utilService.loadEnd();
            return result;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 座席選択
     */
    public selectSeats(seats: Models.Purchase.Reservation.IReservationSeat[]) {
        this.store.dispatch(purchaseAction.selectSeats({ seats }));
    }

    /**
     * 座席選択解除
     */
    public cancelSeats(seats: Models.Purchase.Reservation.IReservationSeat[]) {
        this.store.dispatch(purchaseAction.cancelSeats({ seats }));
    }

    /**
     * チケットオファー検索
     */
    public async searchTicketOffers() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.SearchTicketOffers',
            });
            const { screeningEvent, seller } = await this.getData();
            const clientId = this.cinerinoService.auth.options.clientId;
            if (
                screeningEvent === undefined ||
                seller === undefined ||
                seller.id === undefined ||
                clientId === undefined
            ) {
                throw new Error(
                    'screeningEvent or seller or clientId undefined'
                );
            }
            await this.cinerinoService.getServices();
            const ticketOffers =
                await this.cinerinoService.event.searchTicketOffers({
                    event: { id: screeningEvent.id },
                    seller: {
                        typeOf: seller.typeOf,
                        id: seller.id,
                    },
                    store: {
                        id: clientId,
                    },
                });
            this.store.dispatch(
                purchaseAction.setTicketOffers({
                    ticketOffers,
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
     * 券種選択
     */
    public selectTickets(
        reservations: Models.Purchase.Reservation.IReservation[]
    ) {
        this.store.dispatch(purchaseAction.selectTickets({ reservations }));
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
            } = await this.getData();
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

    /**
     * クレジットカード登録
     */
    public registerCreditCard(
        creditCard:
            | factory.chevre.paymentMethod.paymentCard.creditCard.ICheckedCard
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardRaw
            | factory.chevre.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized
    ) {
        this.store.dispatch(purchaseAction.registerCreditCard({ creditCard }));
    }

    /**
     * クレジットカード登録削除
     */
    public removeCreditCard() {
        this.store.dispatch(purchaseAction.removeCreditCard());
    }

    /**
     * 外部連携情報を購入情報へ変換
     */
    public async externalData2PurchaseData(params: { event: { id: string } }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.ExternalData2PurchaseData',
            });
            const { event } = params;
            await this.cinerinoService.getServices();
            const screeningEvent =
                await this.cinerinoService.event.findById<factory.chevre.eventType.ScreeningEvent>(
                    { id: event.id }
                );
            if (
                screeningEvent.offers === undefined ||
                screeningEvent.offers.seller === undefined ||
                screeningEvent.offers.seller.id === undefined
            ) {
                throw new Error('screeningEvent.offers.seller.id undefined');
            }
            const searchResult =
                await this.cinerinoService.place.searchMovieTheaters({
                    id: { $eq: screeningEvent.superEvent.location.id },
                });
            if (searchResult.data.length === 0) {
                throw new Error('searchMovieTheaters notfound');
            }
            const theater = searchResult.data[0];
            const seller = await this.cinerinoService.seller.findById({
                id: screeningEvent.offers.seller.id,
            });

            this.store.dispatch(
                purchaseAction.setExternalPurchaseData({
                    screeningEvent,
                    seller,
                    theater,
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
