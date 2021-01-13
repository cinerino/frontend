import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, race } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Functions, Models } from '../..';
import { getEnvironment } from '../../../environments/environment';
import { orderAction } from '../../store/actions';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { StarPrintService } from '../star-print.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root'
})
export class ActionOrderService {
    public order: Observable<reducers.IOrderState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService,
        private actions: Actions,
        private starPrintService: StarPrintService,
    ) {
        this.order = this.store.pipe(select(reducers.getOrder));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 注文データ取得
     */
    public async getData() {
        return new Promise<reducers.IOrderState>((resolve) => {
            this.order.subscribe((order) => {
                resolve(order);
            }).unsubscribe();
        });
    }

    /**
     * 注文データ削除
     */
    public delete() {
        this.store.dispatch(orderAction.remove());
    }

    /**
     * 注文キャンセル
     */
    public async cancel(params: {
        orders: factory.order.IOrder[];
        language: string;
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(orderAction.cancel(params));
            const success = this.actions.pipe(
                ofType(orderAction.cancelSuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.cancelFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文検索
     */
    public async search(params: factory.order.ISearchConditions) {
        try {
            this.utilService.loadStart({ process: 'orderAction.Search' });
            await this.cinerinoService.getServices();
            const searchResult = await this.cinerinoService.order.search(params);
            this.utilService.loadEnd();
            return searchResult;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 注文照会
     */
    public async inquiry(params: {
        theaterCode?: string;
        confirmationNumber: string;
        customer: {
            email?: string;
            telephone?: string;
        }
    }) {
        return new Promise<void>((resolve, reject) => {
            this.store.dispatch(orderAction.inquiry(params));
            const success = this.actions.pipe(
                ofType(orderAction.inquirySuccess.type),
                tap(() => { resolve(); })
            );
            const fail = this.actions.pipe(
                ofType(orderAction.inquiryFail.type),
                tap(() => { this.error.subscribe((error) => { reject(error); }).unsubscribe(); })
            );
            race(success, fail).pipe(take(1)).subscribe();
        });
    }

    /**
     * 注文印刷
     */
    public async print(prams: {
        orders: factory.order.IOrder[];
        printer: Models.Common.Printer.IPrinter;
        pos?: factory.chevre.place.movieTheater.IPOS;
        timeout?: number;
    }) {
        const environment = getEnvironment();
        try {
            const orders = prams.orders;
            const printer = prams.printer;
            const pos = prams.pos;
            if (printer.connectionType === Models.Common.Printer.ConnectionType.None) {
                return;
            }
            if (environment.PRINT_LOADING) {
                this.utilService.loadStart({ process: 'orderAction.Print' });
            }
            await this.cinerinoService.getServices();
            const authorizeOrders: { order: factory.order.IOrder; code?: string; }[] = [];
            if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.None) {
                for (const order of orders) {
                    authorizeOrders.push({ order });
                }
            } else if (environment.PRINT_QRCODE_TYPE === Models.Order.Print.PrintQrcodeType.Token) {
                for (const order of orders) {
                    authorizeOrders.push({ order, code: await this.authorizeOrder({ order }) });
                }
            } else {
                for (const order of orders) {
                    authorizeOrders.push({ order });
                    this.authorizeOrder({ order });
                }
            }
            const testFlg = authorizeOrders.length === 0;
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
            await this.printProcess({ printer, canvasList, pos });
            if (environment.PRINT_LOADING) {
                this.utilService.loadEnd();
            }
        } catch (error) {
            if (environment.PRINT_LOADING) {
                this.utilService.loadEnd();
            }
            throw error;
        }
    }

    /**
     * 印刷処理
     */
    private async printProcess(params: {
        printer: Models.Common.Printer.IPrinter;
        canvasList: HTMLCanvasElement[];
        pos?: factory.chevre.place.movieTheater.IPOS;
    }) {
        const printer = params.printer;
        const canvasList = params.canvasList;
        const pos = params.pos;
        switch (printer.connectionType) {
            case Models.Common.Printer.ConnectionType.StarBluetooth:
            case Models.Common.Printer.ConnectionType.StarLAN:
                this.starPrintService.initialize({ printer, pos });
                await this.starPrintService.printProcess({ canvasList });
                break;
            case Models.Common.Printer.ConnectionType.Image:
                const domList = canvasList.map(canvas => `<div class="mb-3 p-4 border border-light-gray shadow-sm">
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
    }

    /**
     * 注文コード発行
     */
    public async authorizeOrder(params: {
        order: factory.order.IOrder;
    }) {
        const environment = getEnvironment();
        const order = params.order;
        const result = await Functions.Util.retry<string>({
            process: (async () => {
                const orderNumber = order.orderNumber;
                const customer = { telephone: order.customer.telephone };
                const { code } = await this.cinerinoService.order.authorize({
                    object: { orderNumber, customer },
                    result: {
                        expiresInSeconds: Number(environment.ORDER_AUTHORIZE_CODE_EXPIRES)
                    }
                });
                return code;
            }),
            interval: 2000,
            limit: 10
        });
        return result;
    }

    /**
     * 注文コード発行
     */
    public async moneyTransfer(params: {
        order: factory.order.IOrder;
        toLocation: {
            typeOf: string;
            identifier: string;
        };
        amount: {
            typeOf: 'MonetaryAmount'
            value: number;
            currency: string;
        };
    }) {
        const environment = getEnvironment();
        const { order, toLocation, amount } = params;
        const seller = order.seller;
        const fromLocation = {
            typeOf: factory.order.OrderType.Order,
            orderNumber: order.orderNumber,
            confirmationNumber: order.confirmationNumber
        };
        const agent = {
            id: order.customer.id,
            typeOf: factory.personType.Person,
            name: `${order.customer.familyName} ${order.customer.givenName}`
        };
        const recipient = {
            id: '',
            typeOf: factory.personType.Person,
            name: toLocation.identifier
        };
        let transaction;
        try {
            this.utilService.loadStart({ process: 'load' });
            if (seller.id === undefined) {
                throw new Error('seller.id === undefined');
            }
            await this.cinerinoService.getServices();
            const passport = await this.cinerinoService.getPassport({ scope: `Transaction:MoneyTransfer:${seller.id}` });
            transaction = await this.cinerinoService.transaction.moneyTransfer.start({
                project: order.project,
                agent,
                recipient,
                seller: { id: seller.id },
                object: {
                    ...{ passport },
                    amount,
                    fromLocation,
                    toLocation,
                    description: environment.ORDER_MONEY_TRANSFER_DESCRIPTION
                },
                expires: moment()
                    .add(1, 'minutes')
                    .toDate(),
            });
        } catch (error) {
            this.utilService.loadEnd();
            throw error;
        }
        try {
            // await this.cinerinoService.transaction.moneyTransfer.setProfile({
            //     id: transaction.id,
            //     agent: {
            //         name: `${order.customer.familyName} ${order.customer.givenName}`,
            //         familyName: order.customer.familyName,
            //         givenName: order.customer.givenName,
            //         telephone: order.customer.telephone
            //     }
            // });

            await this.cinerinoService.transaction.moneyTransfer.confirm({
                id: transaction.id
            });
            this.utilService.loadEnd();
        } catch (error) {
            this.cinerinoService.transaction.moneyTransfer.cancel({
                id: transaction.id
            });
            this.utilService.loadEnd();
            throw error;
        }
    }

}
