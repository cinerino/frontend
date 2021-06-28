import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../../..';
import { purchaseAction } from '../../../store/actions';
import * as reducers from '../../../store/reducers';
import { CinerinoService } from '../../cinerino.service';
import { UtilService } from '../../util.service';
import { ActionStoreService } from '../store.service';

@Injectable({
    providedIn: 'root',
})
export class ActionPaymentService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService,
        private storeService: ActionStoreService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * クレジットカードトークン作成
     */
    public async createCreditCardToken(creditCard: {
        cardno: string;
        expire: string;
        holderName: string;
        securityCode: string;
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.CreateCreditCardToken',
            });
            const { seller } = await this.storeService.getPurchaseData();
            if (seller === undefined) {
                throw new Error('seller undefined');
            }
            const creditCardToken =
                await Functions.Creditcard.createCreditCardTokenObject({
                    creditCard,
                    seller,
                });
            this.store.dispatch(
                purchaseAction.setCreditCardTokenObject({ creditCardToken })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * クレジットカード承認
     */
    public async authorizeCreditCard(params: { amount: number }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.AuthorizeCreditCard',
            });
            const { creditCard, authorizeCreditCardPayments, transaction } =
                await this.storeService.getPurchaseData();
            const amount = params.amount;
            const authorizeCreditCardPayment = authorizeCreditCardPayments[0];
            if (transaction === undefined) {
                throw new Error('transaction undefined');
            }
            await this.cinerinoService.getServices();
            if (authorizeCreditCardPayment !== undefined) {
                await this.cinerinoService.payment.voidTransaction(
                    authorizeCreditCardPayment
                );
            }
            const authorizeResult =
                await this.cinerinoService.payment.authorizeCreditCard({
                    object: {
                        typeOf: factory.action.authorize.paymentMethod.any
                            .ResultType.Payment,
                        amount,
                        method: '1',
                        creditCard,
                        paymentMethod:
                            factory.chevre.paymentMethodType.CreditCard,
                    },
                    purpose: transaction,
                });
            this.store.dispatch(
                purchaseAction.setAuthorizeCreditCard({ authorizeResult })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * ムビチケ承認
     */
    public async authorizeMovieTicket() {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.AuthorizeMovieTicket',
            });
            const {
                authorizeMovieTicketPayments,
                transaction,
                pendingMovieTickets,
                authorizeSeatReservations,
                seller,
            } = await this.storeService.getPurchaseData();
            if (transaction === undefined || seller === undefined) {
                throw new Error('transaction or seller undefined');
            }
            if (authorizeMovieTicketPayments.length > 0) {
                for (const authorizeMovieTicketPayment of authorizeMovieTicketPayments) {
                    await this.cinerinoService.payment.voidTransaction(
                        authorizeMovieTicketPayment
                    );
                }
            }
            const authorizeResults: factory.action.authorize.paymentMethod.any.IAction[] =
                [];
            for (const authorizeSeatReservation of authorizeSeatReservations) {
                const movieTickets =
                    Functions.Purchase.createMovieTicketsFromAuthorizeSeatReservation(
                        {
                            authorizeSeatReservation,
                            pendingMovieTickets,
                            seller,
                        }
                    );
                const movieTicketIdentifiers: {
                    identifier: string;
                    movieTickets: factory.chevre.paymentMethod.paymentCard.movieTicket.IMovieTicket[];
                }[] = [];
                movieTickets.forEach((movieTicket) => {
                    const findResult = movieTicketIdentifiers.find(
                        (movieTicketIdentifier) => {
                            return (
                                movieTicketIdentifier.identifier ===
                                movieTicket.identifier
                            );
                        }
                    );
                    if (findResult === undefined) {
                        movieTicketIdentifiers.push({
                            identifier: movieTicket.identifier,
                            movieTickets: [movieTicket],
                        });
                        return;
                    }
                    findResult.movieTickets.push(movieTicket);
                });
                for (const movieTicketIdentifier of movieTicketIdentifiers) {
                    const authorizeResult =
                        await this.cinerinoService.payment.authorizeMovieTicket(
                            {
                                object: {
                                    typeOf: factory.action.authorize
                                        .paymentMethod.any.ResultType.Payment,
                                    amount: 0,
                                    movieTickets:
                                        movieTicketIdentifier.movieTickets,
                                    paymentMethod:
                                        movieTicketIdentifier.movieTickets[0]
                                            .typeOf,
                                },
                                purpose: transaction,
                            }
                        );
                    authorizeResults.push(authorizeResult);
                }
            }
            this.store.dispatch(
                purchaseAction.setAuthorizeMovieTicket({ authorizeResults })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * ムビチケ認証
     */
    public async checkMovieTicket(params: {
        movieTicket: {
            code: string;
            password: string;
        };
        paymentMethodType: factory.paymentMethodType;
    }) {
        try {
            this.utilService.loadStart({
                process: 'purchaseAction.CheckMovieTicket',
            });
            const movieTickets = [
                {
                    typeOf: params.paymentMethodType,
                    identifier: params.movieTicket.code, // 購入管理番号
                    accessCode: params.movieTicket.password, // PINコード
                },
            ];
            const { transaction, screeningEvent } =
                await this.storeService.getPurchaseData();
            if (
                transaction === undefined ||
                transaction.seller.id === undefined ||
                screeningEvent === undefined
            ) {
                throw new Error(
                    'transaction or transaction.seller.id or screeningEvent undefined'
                );
            }
            const checkMovieTicketAction =
                await this.cinerinoService.payment.checkMovieTicket({
                    typeOf: movieTickets[0].typeOf,
                    movieTickets: movieTickets.map((movieTicket) => {
                        return {
                            ...movieTicket,
                            project: screeningEvent.project,
                            serviceType: '', // 情報空でよし
                            serviceOutput: {
                                reservationFor: {
                                    typeOf: screeningEvent.typeOf,
                                    id: screeningEvent.id,
                                },
                                reservedTicket: {
                                    ticketedSeat: {
                                        typeOf: factory.chevre.placeType.Seat,
                                        seatingType: '', // 情報空でよし
                                        seatNumber: '', // 情報空でよし
                                        seatRow: '', // 情報空でよし
                                        seatSection: '', // 情報空でよし
                                    },
                                },
                            },
                        };
                    }),
                    seller: {
                        typeOf: transaction.seller.typeOf,
                        id: transaction.seller.id,
                    },
                });

            this.store.dispatch(
                purchaseAction.setCheckMovieTicket({ checkMovieTicketAction })
            );
            this.utilService.loadEnd();
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
