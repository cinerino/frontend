import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { map, mergeMap } from 'rxjs/operators';
import { Functions, Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
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
     * Cancel
     */
    @Effect()
    public cancel = this.actions.pipe(
        ofType(orderAction.cancel),
        map(action => action),
        mergeMap(async (payload) => {
            const environment = getEnvironment();
            const orders = payload.orders;
            const agent = payload.agent;
            try {
                await this.cinerino.getServices();
                for (const order of orders) {
                    const startResult = await this.cinerino.transaction.returnOrder.start({
                        expires: moment().add(1, 'day').toDate(),
                        object: {
                            order: {
                                orderNumber: order.orderNumber,
                                customer: { telephone: order.customer.telephone, }
                            }
                        },
                        agent
                    });
                    const eventOrders = Functions.Purchase.order2EventOrders({ order });
                    const creditCards = order.paymentMethods.filter(p => p.typeOf === factory.paymentMethodType.CreditCard);
                    const email: factory.creativeWork.message.email.ICustomization = {
                        sender: {
                            name: (this.translate.instant('email.order.return.sender.name') === '')
                                ? eventOrders[0].event.superEvent.location.name?.ja
                                : this.translate.instant('email.order.return.sender.name'),
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
                    if (environment.ORDER_CANCEL_MAIL_CUSTOM) {
                        // 返品メールをカスタマイズ
                        const view = await this.utilService.getText(`${Functions.Util.getProject().storageUrl}/ejs/mail/return/${payload.language}.ejs`);
                        const template = (<any>window).ejs.render(view, {
                            moment,
                            formatTelephone: Functions.Util.formatTelephone,
                            getItemPrice: Functions.Purchase.getItemPrice
                        });
                        email.template = template;
                    }
                    const refundCreditCardEmail: factory.creativeWork.message.email.ICustomization = {
                        sender: {
                            name: (this.translate.instant('email.order.refundCreditCard.sender.name') === '')
                                ? eventOrders[0].event.superEvent.location.name?.ja
                                : this.translate.instant('email.order.refundCreditCard.sender.name'),
                            email: (this.translate.instant('email.order.refundCreditCard.sender.email') === '')
                                ? undefined : this.translate.instant('email.order.refundCreditCard.sender.email')
                        },
                        toRecipient: {
                            name: (this.translate.instant('email.order.refundCreditCard.toRecipient.name') === '')
                                ? undefined : this.translate.instant('email.order.refundCreditCard.toRecipient.name'),
                            email: (this.translate.instant('email.order.refundCreditCard.toRecipient.email') === '')
                                ? undefined : this.translate.instant('email.order.refundCreditCard.toRecipient.email')
                        },
                        about: (this.translate.instant('email.order.refundCreditCard.about') === '')
                            ? undefined : this.translate.instant('email.order.refundCreditCard.about'),
                        template: undefined
                    };
                    if (environment.ORDER_CANCEL_MAIL_CUSTOM) {
                        // 返金メールをカスタマイズ
                        const path = `/ejs/mail/refundCreditCard/${payload.language}.ejs`;
                        const url = (await Functions.Util.isFile(`${Functions.Util.getProject().storageUrl}${path}`))
                            ? `${Functions.Util.getProject().storageUrl}${path}`
                            : `/default${path}`;
                        const view = await this.utilService.getText(url);
                        const template = await (<any>window).ejs.render(view, {
                            moment,
                            formatTelephone: Functions.Util.formatTelephone,
                            getItemPrice: Functions.Purchase.getItemPrice,
                            eventOrders
                        }, { async: true });
                        refundCreditCardEmail.template = template;
                    }
                    await this.cinerino.transaction.returnOrder.confirm({
                        id: startResult.id,
                        potentialActions: {
                            returnOrder: {
                                potentialActions: {
                                    refundCreditCard: creditCards.map((c) => {
                                        return {
                                            object: { object: [{ paymentMethod: { paymentMethodId: c.paymentMethodId } }] },
                                            potentialActions: { sendEmailMessage: { object: refundCreditCardEmail } }
                                        };
                                    }),
                                    sendEmailMessage: [{ object: email }]
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
                                const searchResult = await this.cinerino.order.search({
                                    orderNumbers: orders.map(o => o.orderNumber)
                                });
                                searchResultData = searchResult.data;
                                const filterResult = searchResultData.filter(o => o.orderStatus !== factory.orderStatus.OrderReturned);
                                if (filterResult.length === 0) {
                                    return resolve();
                                }
                                if (i > limit) {
                                    return reject({ error: 'timeout' });
                                }
                                await Functions.Util.sleep(5000);
                            } catch (error) {
                                return reject(error);
                            }
                        }
                    });
                };
                await orderStatusWatch();

                return orderAction.cancelSuccess();
            } catch (error) {
                return orderAction.cancelFail({ error: error });
            }
        })
    );

    /**
     * Inquiry
     */
    @Effect()
    public load = this.actions.pipe(
        ofType(orderAction.inquiry),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const environment = getEnvironment();
                await this.cinerino.getServices();
                const now = (await this.utilService.getServerTime()).date;
                const today = moment(moment(now).format('YYYYMMDD'), 'YYYYMMDD').toISOString();
                const confirmationNumber = payload.confirmationNumber;
                const customer = {
                    telephone: (payload.customer.telephone === undefined)
                        ? '' : Functions.Util.formatTelephone(payload.customer.telephone)
                };
                const orderDateFrom = {
                    value: environment.INQUIRY_ORDER_DATE_FROM_VALUE,
                    unit: environment.INQUIRY_ORDER_DATE_FROM_UNIT
                };
                const params = {
                    confirmationNumber,
                    customer,
                    orderDateFrom: moment(today).add(orderDateFrom.value, orderDateFrom.unit).toDate(),
                    orderDateThrough: moment(now).toDate()
                };
                const findResult = await this.cinerino.order.findByConfirmationNumber(params);
                const order = (Array.isArray(findResult)) ? findResult[0] : findResult;
                return orderAction.inquirySuccess({ order });
            } catch (error) {
                return orderAction.inquiryFail({ error: error });
            }
        })
    );

    /**
     * print
     */
    @Effect()
    public print = this.actions.pipe(
        ofType(orderAction.print),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const environment = getEnvironment();
                const orders = payload.orders;
                const printer = payload.printer;
                const pos = payload.pos;
                await this.cinerino.getServices();
                const authorizeOrders: { order: factory.order.IOrder, code: string; }[] = [];
                for (const order of orders) {
                    const result = await Functions.Util.retry<string>({
                        process: (async () => {
                            const orderNumber = order.orderNumber;
                            const customer = {
                                // email: args.order.customer.email,
                                telephone: order.customer.telephone
                            };
                            const { code } = await this.cinerino.order.authorize({
                                object: { orderNumber, customer },
                                result: {
                                    expiresInSeconds: Number(environment.ORDER_AUTHORIZE_CODE_EXPIRES)
                                }
                            });

                            return code;
                        }),
                        interval: 5000,
                        limit: 5
                    });

                    authorizeOrders.push({ order, code: result });
                }
                const testFlg = orders.length === 0;
                const path = `/ejs/print/ticket.ejs`;
                const url = (testFlg) ? '/default//ejs/print/test.ejs'
                    : (await Functions.Util.isFile(`${Functions.Util.getProject().storageUrl}${path}`))
                        ? `${Functions.Util.getProject().storageUrl}${path}`
                        : `/default${path}`;
                const printData = await this.utilService.getText(url);
                const canvasList: HTMLCanvasElement[] = [];
                if (testFlg) {
                    const canvas = await Functions.Order.createTestPrintCanvas4Html({ view: <string>printData });
                    canvasList.push(canvas);
                } else {
                    for (const authorizeOrder of authorizeOrders) {
                        let index = 0;
                        for (const acceptedOffer of authorizeOrder.order.acceptedOffers) {
                            const qrcode = Functions.Order.createQRCode({
                                acceptedOffer,
                                order: authorizeOrder.order,
                                index,
                                code: authorizeOrder.code
                            });
                            const canvas = await Functions.Order.createPrintCanvas4Html({
                                view: <string>printData,
                                order: authorizeOrder.order,
                                pos,
                                qrcode,
                                index
                            });
                            canvasList.push(canvas);
                            index++;
                        }
                    }
                }
                switch (printer.connectionType) {
                    case Models.Common.Printer.ConnectionType.StarBluetooth:
                        this.starPrint.initialize({ printer, pos });
                        await this.starPrint.printProcess({ canvasList, testFlg });
                        break;
                    case Models.Common.Printer.ConnectionType.StarLAN:
                        this.starPrint.initialize({ printer, pos });
                        await this.starPrint.printProcess({ canvasList, testFlg });
                        break;
                    case Models.Common.Printer.ConnectionType.Image:
                        const domList = canvasList.map(canvas => `<div class="mb-3 p-4 border border-light-gray ">
                        <img class="w-100" src="${canvas.toDataURL()}" alt="">
                        </div>`);
                        this.utilService.openAlert({
                            title: '',
                            body: `<div class="px-5">${domList.join('\n')}</div>`
                        });
                        break;
                    default:
                        break;
                }

                return orderAction.printSuccess();
            } catch (error) {
                return orderAction.printFail({ error: error });
            }
        })
    );


}
