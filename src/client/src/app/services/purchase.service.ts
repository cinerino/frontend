import { Injectable } from '@angular/core';
import { factory } from '@cinerino/api-javascript-client';
import { CinerinoService } from './cinerino.service';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {

    constructor(
        private cinerino: CinerinoService
    ) { }

    /**
     * 劇場一覧取得
     */
    public async getTheater() {
        await this.cinerino.getServices();
        const movieTheaters = await this.cinerino.organization.searchMovieTheaters({});

        return movieTheaters;
    }

    /**
     * スケジュール取得
     */
    public async getSchedule(args: factory.chevre.event.screeningEvent.ISearchConditions) {
        await this.cinerino.getServices();
        const IndividualScreeningEvent = await this.cinerino.event.searchScreeningEvents(args);

        return IndividualScreeningEvent;
    }

    /**
     * スクリーン取得
     */
    public async getScreen() {
    }

    /**
     * パスポート取得
     */
    public async getPassports() {
    }

    /**
     * 取引開始
     */
    public async transactionStartProcess() {

    }

    /**
     * 販売可能券種取得
     */
    public async getSalesTickets() {

    }

    /**
     * 座席確定
     */
    public async seatSelectProcess() {

    }

    /**
     * 券種確定
     */
    public async ticketSelectProcess() {

    }

    /**
     * 購入情報入力
     */
    public async purchaseInputProcess() {

    }

    /**
     * GMOトークン取得処理
     */
    public async getGmoTokenProcess(args: {
        cardno: string;
        expire: string;
        securitycode: string;
        holdername: string;
    }) {
        const sendParam = {
            cardno: args.cardno,
            expire: args.expire,
            securitycode: args.securitycode,
            holdername: args.holdername
        };
        const shopId = '';
        return new Promise<any>((resolve, reject) => {
            (<any>window).someCallbackFunction = (response: any) => {
                if (response.resultCode === '000') {
                    console.log(response.tokenObject);
                    resolve();
                } else {
                    reject(new Error(response.resultCode));
                }
            };
            const Multipayment = (<any>window).Multipayment;
            Multipayment.init(shopId);
            Multipayment.getToken(sendParam, (<any>window).someCallbackFunction);
        });
    }

    /**
     * 決済処理
     */
    public async paymentProcess() {

    }

    /**
     * 取引確定
     */
    public async transactionEndProcess() {

    }
}
