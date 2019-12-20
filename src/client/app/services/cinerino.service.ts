import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cinerino from '@cinerino/api-javascript-client';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root'
})
export class CinerinoService {
    public auth: cinerino.IImplicitGrantClient;
    public account: cinerino.service.Account;
    public event: cinerino.service.Event;
    public offer: cinerino.service.Offer;
    public order: cinerino.service.Order;
    public seller: cinerino.service.Seller;
    public person: cinerino.service.Person;
    public ownershipInfo: cinerino.service.person.OwnershipInfo;
    public reservation: cinerino.service.Reservation;
    public task: cinerino.service.Task;
    public payment: cinerino.service.Payment;
    public transaction: {
        placeOrder: cinerino.service.transaction.PlaceOrder,
        returnOrder: cinerino.service.transaction.ReturnOrder
    };
    public userName: string;
    private endpoint: string;
    private waiterServerUrl: string;

    constructor(
        private http: HttpClient,
        private utilservice: UtilService
    ) { }

    /**
     * getServices
     */
    public async getServices(): Promise<void> {
        try {
            const option = await this.createOption();
            this.account = new cinerino.service.Account(option);
            this.event = new cinerino.service.Event(option);
            this.offer = new cinerino.service.Offer(option);
            this.order = new cinerino.service.Order(option);
            this.seller = new cinerino.service.Seller(option);
            this.person = new cinerino.service.Person(option);
            this.ownershipInfo = new cinerino.service.person.OwnershipInfo(option);
            this.reservation = new cinerino.service.Reservation(option);
            this.task = new cinerino.service.Task(option);
            this.payment = new cinerino.service.Payment(option);
            this.transaction = {
                placeOrder: new cinerino.service.transaction.PlaceOrder(option),
                returnOrder: new cinerino.service.transaction.ReturnOrder(option)
            };
        } catch (err) {
            console.error(err);
            throw new Error('getServices is failed');
        }
    }

    /**
     * @method createOption
     */
    public async createOption() {
        await this.authorize();
        return {
            endpoint: this.endpoint,
            auth: this.auth
        };
    }

    /**
     * @method authorize
     */
    public async authorize() {
        const data = (<Storage>(<any>window)[environment.STORAGE_TYPE]).getItem(environment.STORAGE_NAME);
        if (data === null) {
            throw new Error('state is null');
        }
        const state = JSON.parse(data);
        const url = '/api/authorize/getCredentials';
        const body = { member: '0' };
        if (state.App && state.App.userData.isMember) {
            body.member = '1';
        }
        if (this.auth !== undefined
            && this.auth.credentials.expiryDate !== undefined
            && body.member !== '1') {
            const now = (await this.utilservice.getServerTime()).date;
            const expiryDate = this.auth.credentials.expiryDate;
            const isTokenExpired = (expiryDate !== undefined)
                ? (moment(expiryDate).add(-5, 'minutes').unix() <= moment(now).unix()) : false;
            if (!isTokenExpired) {
                // アクセストークン取得・更新しない
                return;
            }
        }
        // アクセストークン取得・更新
        const result = await this.http.post<{
            accessToken: string;
            expiryDate?: number;
            userName: string;
            clientId: string;
            endpoint: string;
            waiterServerUrl: string;
        }>(url, body).toPromise();
        const option = {
            domain: '',
            clientId: result.clientId,
            redirectUri: '',
            logoutUri: '',
            responseType: '',
            scope: '',
            state: '',
            nonce: null,
            tokenIssuer: ''
        };
        this.auth = cinerino.createAuthInstance(option);
        this.auth.setCredentials({ accessToken: result.accessToken, expiryDate: result.expiryDate });
        this.userName = result.userName;
        this.endpoint = result.endpoint;
        this.waiterServerUrl = result.waiterServerUrl;
    }

    /**
     * サインイン
     */
    public async signIn() {
        const url = '/api/authorize/signIn';
        const result = await this.http.get<any>(url, {}).toPromise();
        // console.log(result.url);
        location.href = result.url;
    }

    /**
     * サインアウト
     */
    public async signOut() {
        const url = '/api/authorize/signOut';
        const result = await this.http.get<any>(url, {}).toPromise();
        // console.log(result.url);
        location.href = result.url;
    }

    /**
     * パスポート取得
     */
    public async getPassport(selleId: string) {
        if (this.waiterServerUrl === undefined
            || this.waiterServerUrl === '') {
            return { token: '' };
        }
        const url = this.waiterServerUrl;
        const body = { scope: `Transaction:PlaceOrder:${selleId}` };
        const result = await this.http.post<{ token: string; }>(url, body).toPromise();

        return result;
    }
}
