import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { createPrintCanvas, createTestPrintCanvas, formatTelephone, retry, sleep } from '../../functions';
import { connectionType, ITicketPrintData, PrintQrcodeType } from '../../models';
import { CinerinoService, StarPrintService, UtilService } from '../../services';
import { orderAction } from '../actions';

/**
 * Order Effects
 */
@Injectable()
export class OrderEffects {

    constructor(
        private actions: Actions,
        private cinerino: CinerinoService,
        private utilService: UtilService,
        private starPrint: StarPrintService,
        private translate: TranslateService
    ) { }

    /**
     * Search
     */
    @Effect()
    public search = this.actions.pipe(
        ofType<orderAction.Search>(orderAction.ActionTypes.Search),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const params = payload.params;
                // if (params.customer !== undefined
                //     && params.customer.telephone !== undefined) {
                //     params.customer.telephone = formatTelephone(params.customer.telephone)
                // }
                const searchResult = await this.cinerino.person.searchOrders({ ...params });
                const limit = <number>params.limit;
                return new orderAction.SearchSuccess({ searchResult, limit });
            } catch (error) {
                return new orderAction.SearchFail({ error: error });
            }
        })
    );

    /**
     * Cancel
     */
    @Effect()
    public cancel = this.actions.pipe(
        ofType<orderAction.Cancel>(orderAction.ActionTypes.Cancel),
        map(action => action.payload),
        mergeMap(async (payload) => {
            const orders = payload.orders;
            try {
                await this.cinerino.getServices();
                for (const order of orders) {
                    const startResult = await this.cinerino.transaction.returnOrder.start({
                        expires: moment().add(1, 'day').toDate(),
                        object: {
                            order: {
                                orderNumber: order.orderNumber,
                                customer: {
                                    telephone: order.customer.telephone,
                                    // email: order.customer.email
                                }
                            }
                        }
                    });
                    const creditCards = order.paymentMethods.filter(p => p.typeOf === factory.paymentMethodType.CreditCard);
                    const email: factory.creativeWork.message.email.ICustomization = {
                        sender: {
                            name: (this.translate.instant('email.order.return.sender.name') === '')
                                ? undefined : this.translate.instant('email.order.return.sender.name'),
                            email: (this.translate.instant('email.order.return.sender.email') === '')
                                ? undefined : this.translate.instant('email.order.return.sender.email')
                        },
                        toRecipient: {
                            name: (this.translate.instant('email.order.return.toRecipient.name') === '')
                                ? undefined : this.translate.instant('email.order.return.toRecipient.name'),
                            email: (this.translate.instant('email.order.return.toRecipient.email') === '')
                                ? undefined : this.translate.instant('email.order.return.toRecipient.email')
                        },
                        about: (this.translate.instant('email.order.return.about') === '')
                            ? undefined : this.translate.instant('email.order.return.about'),
                        template: undefined
                    };
                    if (environment.PURCHASE_COMPLETE_MAIL_CUSTOM) {
                        // メールをカスタマイズ
                        email.template = (await this.utilService.postJson<{ template: string }>(
                            '/api/mail/template',
                            {view: '/ejs/mail/return.ejs'})).template;
                    }
                    await this.cinerino.transaction.returnOrder.confirm({
                        id: startResult.id,
                        potentialActions: {
                            returnOrder: {
                                potentialActions: {
                                    refundCreditCard: creditCards.map((c) => {
                                        return {
                                            object: {
                                                object: [{
                                                    paymentMethod: {
                                                        paymentMethodId: c.paymentMethodId
                                                    }
                                                }]
                                            },
                                            potentialActions: {
                                                sendEmailMessage: {
                                                    object: email
                                                }
                                            }
                                        };
                                    })
                                }
                            }
                        }
                    });
                }

                const orderStatusWatch = () => {
                    return new Promise<void>(async (resolve, reject) => {
                        const limit = 10;
                        for (let i = 0; i < limit; i++) {
                            try {
                                let searchResultData;
                                if (orders.length === 1) {
                                    const searchResult = await this.cinerino.order.findByConfirmationNumber({
                                        confirmationNumber: Number(orders[0].confirmationNumber),
                                        customer: { telephone: orders[0].customer.telephone }
                                    });
                                    searchResultData = [searchResult];
                                } else {
                                    const searchResult = await this.cinerino.order.search({
                                        orderNumbers: orders.map(o => o.orderNumber)
                                    });
                                    searchResultData = searchResult.data;
                                }
                                const filterResult = searchResultData.filter(o => o.orderStatus !== factory.orderStatus.OrderReturned);
                                if (filterResult.length === 0) {
                                    return resolve();
                                }
                                if (i > limit) {
                                    return reject({ error: 'timeout' });
                                }
                                await sleep(5000);
                            } catch (error) {
                                return reject(error);
                            }
                        }
                    });
                };
                await orderStatusWatch();

                return new orderAction.CancelSuccess();
            } catch (error) {
                return new orderAction.CancelFail({ error: error });
            }
        })
    );

    /**
     * Inquiry
     */
    @Effect()
    public load = this.actions.pipe(
        ofType<orderAction.Inquiry>(orderAction.ActionTypes.Inquiry),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                await this.cinerino.getServices();
                const confirmationNumber = Number(payload.confirmationNumber);
                const customer = {
                    telephone: (payload.customer.telephone === undefined)
                        ? '' : formatTelephone(payload.customer.telephone)
                };
                const order = await this.cinerino.order.findByConfirmationNumber({
                    confirmationNumber, customer
                });

                return new orderAction.InquirySuccess({ order });
            } catch (error) {
                return new orderAction.InquiryFail({ error: error });
            }
        })
    );

    /**
     * print
     */
    @Effect()
    public print = this.actions.pipe(
        ofType<orderAction.Print>(orderAction.ActionTypes.Print),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const orders = payload.orders;
                const printer = payload.printer;
                const pos = payload.pos;
                await this.cinerino.getServices();
                const authorizeOrders: factory.order.IOrder[] = [];
                for (const order of orders) {
                    const result = await retry<factory.order.IOrder>({
                        process: (async () => {
                            const orderNumber = order.orderNumber;
                            const customer = {
                                // email: args.order.customer.email,
                                telephone: order.customer.telephone
                            };
                            const authorizeOrder = await this.cinerino.order.authorizeOwnershipInfos({ orderNumber, customer });

                            return authorizeOrder;
                        }),
                        interval: 5000,
                        limit: 5
                    });

                    authorizeOrders.push(result);
                }
                const printData = await this.utilService.getJson<ITicketPrintData>('/storage/json/print/ticket.json');
                const testFlg = orders.length === 0;
                const canvasList: HTMLCanvasElement[] = [];
                if (testFlg) {
                    const canvas = await createTestPrintCanvas({ printData });
                    canvasList.push(canvas);
                } else {
                    for (const authorizeOrder of authorizeOrders) {
                        let index = 0;
                        for (const acceptedOffer of authorizeOrder.acceptedOffers) {
                            const itemOffered = acceptedOffer.itemOffered;
                            if (itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                                continue;
                            }
                            const order = authorizeOrder;
                            let qrcode = itemOffered.reservedTicket.ticketToken;
                            const additionalProperty = (itemOffered.reservationFor.workPerformed === undefined)
                                ? undefined : itemOffered.reservationFor.workPerformed.additionalProperty;
                            if (additionalProperty !== undefined) {
                                // 追加特性のqrcodeがfalseの場合QR非表示
                                const isDisplayQrcode = additionalProperty.find(a => a.name === 'qrcode');
                                if (isDisplayQrcode !== undefined && isDisplayQrcode.value === 'false') {
                                    qrcode = undefined;
                                }
                            }
                            if (qrcode !== undefined
                                && environment.PRINT_QRCODE_TYPE === PrintQrcodeType.Encryption) {
                                // QRコード暗号化(id + startDate)
                                const encyptText = `${itemOffered.reservationFor.id}=${itemOffered.reservationFor.startDate}`;
                                const encryptionEncodeResult = await this.utilService.encryptionEncode(encyptText);
                                qrcode =
                                    `${encryptionEncodeResult.salt},${encryptionEncodeResult.iv},${encryptionEncodeResult.encrypted}`;
                            }
                            if (qrcode !== undefined
                                && environment.PRINT_QRCODE_TYPE === PrintQrcodeType.Custom) {
                                // QRコードカスタム文字列
                                qrcode = environment.PRINT_QRCODE_CUSTOM;
                                qrcode = qrcode
                                    .replace(/\{\{ orderDate \| YYMMDD \}\}/g, moment(order.orderDate).format('YYMMDD'));
                                qrcode = qrcode
                                    .replace(/\{\{ confirmationNumber \}\}/g, order.confirmationNumber);
                                qrcode = qrcode
                                    .replace(/\{\{ confirmationNumber \| [0-9] \}\}/g, (match) => {
                                        const digit = Number(match.replace(/\{\{ confirmationNumber \| ([0-9]) \}\}/, '$1'));
                                        return `000000000${order.confirmationNumber}`.slice(-1 * digit);
                                    });
                                qrcode = qrcode
                                    .replace(/\{\{ index \}\}/g, String(index));
                                qrcode = qrcode
                                    .replace(/\{\{ index \| [0-9] \}\}/g, (match) => {
                                        const digit = Number(match.replace(/\{\{ index \| ([0-9]) \}\}/, '$1'));
                                        return `000000000${String(index)}`.slice(-1 * digit);
                                    });
                                qrcode = qrcode
                                    .replace(/\{\{ orderNumber \}\}/g, order.orderNumber);
                                qrcode = qrcode
                                    .replace(
                                        /\{\{ startDate \| YYMMDD \}\}/g,
                                        moment(itemOffered.reservationFor.startDate).format('YYMMDD')
                                    );
                            }
                            const canvas = await createPrintCanvas({ printData, order, acceptedOffer, pos, qrcode, index });
                            canvasList.push(canvas);
                            index++;
                        }
                    }
                }
                switch (printer.connectionType) {
                    case connectionType.StarBluetooth:
                        this.starPrint.initialize({ printer, pos });
                        await this.starPrint.printProcess({ canvasList, testFlg });
                        break;
                    case connectionType.StarLAN:
                        this.starPrint.initialize({ printer, pos });
                        await this.starPrint.printProcess({ canvasList, testFlg });
                        break;
                    case connectionType.Image:
                        const domList = canvasList.map(canvas => `<div class="mb-3 p-4 border border-light-gray ">
                        <img class="w-100" src="${canvas.toDataURL()}">
                        </div>`);
                        this.utilService.openAlert({
                            title: '',
                            body: `<div class="px-5">${domList.join('\n')}</div>`
                        });
                        break;
                    default:
                        break;
                }

                return new orderAction.PrintSuccess();
            } catch (error) {
                return new orderAction.PrintFail({ error: error });
            }
        })
    );

    /**
     * orderAuthorize
     */
    @Effect()
    public orderAuthorize = this.actions.pipe(
        ofType<orderAction.OrderAuthorize>(orderAction.ActionTypes.OrderAuthorize),
        map(action => action.payload),
        mergeMap(async (payload) => {
            try {
                const params = Object.assign({ personId: 'me' }, payload);
                await this.cinerino.getServices();
                const order = await this.cinerino.order.authorizeOwnershipInfos(params);
                return new orderAction.OrderAuthorizeSuccess({ order });
            } catch (error) {
                return new orderAction.OrderAuthorizeFail({ error: error });
            }
        })
    );

}
