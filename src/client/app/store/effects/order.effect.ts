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
                const confirmationNumber = Number(payload.confirmationNumber);
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
                // const itemOffered = <factory.chevre.reservation.IReservation<
                //     factory.chevre.reservationType.EventReservation
                // >>order.acceptedOffers[0].itemOffered;
                // if (itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                //     throw new Error('reservationType not EventReservation');
                // }
                // const startDate =
                //     moment(moment(itemOffered.reservationFor.startDate).format('YYYYMMDD'), 'YYYYMMDD').toDate();
                // if (!(moment(today).add(-1, 'day').unix() < moment(startDate).unix()
                //     && moment(startDate).unix() < moment(today).add(1, 'day').unix())) {
                //     // 上映開始日が本日以外
                //     throw new Error('outside the period');
                // }
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
                const authorizeOrders: factory.order.IOrder[] = [];
                for (const order of orders) {
                    const result = await Functions.Util.retry<factory.order.IOrder>({
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
                        for (const acceptedOffer of authorizeOrder.acceptedOffers) {
                            if (acceptedOffer.itemOffered.typeOf !== factory.chevre.reservationType.EventReservation) {
                                continue;
                            }
                            const itemOffered = <factory.chevre.reservation.IReservation<
                                factory.chevre.reservationType.EventReservation
                            >>acceptedOffer.itemOffered;
                            const order = authorizeOrder;
                            let qrcode;
                            if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.None) {
                                // なし
                                qrcode = undefined;
                            } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Token) {
                                // トークン
                                qrcode = itemOffered.reservedTicket.ticketToken;
                            } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Admission) {
                                // 入場
                                qrcode = JSON.stringify({
                                    orderNumber: authorizeOrder.orderNumber,
                                    id: itemOffered.id
                                });
                            } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Custom) {
                                // カスタム文字列
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
                            const additionalProperty = (itemOffered.reservationFor.workPerformed !== undefined
                                && itemOffered.reservationFor.workPerformed.additionalProperty !== undefined
                                && itemOffered.reservationFor.workPerformed.additionalProperty.length > 0)
                                ? itemOffered.reservationFor.workPerformed.additionalProperty :
                                (itemOffered.additionalProperty !== undefined
                                    && itemOffered.additionalProperty.length > 0) ?
                                    itemOffered.additionalProperty
                                    : undefined;
                            if (additionalProperty !== undefined) {
                                // 追加特性のqrcodeがfalseの場合QR非表示
                                const isDisplayQrcode = additionalProperty.find(a => a.name === 'qrcode');
                                if (isDisplayQrcode !== undefined && isDisplayQrcode.value === 'false') {
                                    qrcode = undefined;
                                }
                            }
                            const canvas = await Functions.Order.createPrintCanvas4Html({
                                view: <string>printData, order, pos, qrcode, index
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

    /**
     * orderAuthorize
     */
    @Effect()
    public orderAuthorize = this.actions.pipe(
        ofType(orderAction.orderAuthorize),
        map(action => action),
        mergeMap(async (payload) => {
            try {
                const params = Object.assign({ personId: 'me' }, payload);
                await this.cinerino.getServices();
                const order = await this.cinerino.order.authorizeOwnershipInfos(params);
                return orderAction.orderAuthorizeSuccess({ order });
            } catch (error) {
                return orderAction.orderAuthorizeFail({ error: error });
            }
        })
    );

}
