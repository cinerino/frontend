import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cinerino from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions } from '..';
import { getEnvironment } from '../../environments/environment';
import { UtilService } from './util.service';

@Injectable({
    providedIn: 'root',
})
export class CinerinoService {
    public auth: cinerino.auth.ClientCredentials | cinerino.auth.OAuth2;
    public account: cinerino.service.Account;
    public creativeWork: cinerino.service.CreativeWork;
    public categoryCode: cinerino.service.CategoryCode;
    public event: cinerino.service.Event;
    public offer: cinerino.service.Offer;
    public order: cinerino.service.Order;
    public seller: cinerino.service.Seller;
    public person: cinerino.service.Person;
    public product: cinerino.service.Product;
    public project: cinerino.service.Project;
    public place: cinerino.service.Place;
    public ownershipInfo: cinerino.service.person.OwnershipInfo;
    public reservation: cinerino.service.Reservation;
    public payment: cinerino.service.Payment;
    public serviceOutput: cinerino.service.ServiceOutput;
    public token: cinerino.service.Token;
    public transaction: {
        placeOrder: cinerino.service.transaction.PlaceOrder;
        returnOrder: cinerino.service.transaction.ReturnOrder;
        moneyTransfer: cinerino.service.transaction.MoneyTransfer;
    };
    public userName: string;
    public environment = getEnvironment();
    private endpoint: string;
    private waiterServerUrl: string;

    constructor(private http: HttpClient, private utilservice: UtilService) {}

    /**
     * getServices
     */
    public async getServices(): Promise<void> {
        try {
            const option = await this.createOption();
            this.account = new cinerino.service.Account(option);
            this.creativeWork = new cinerino.service.CreativeWork(option);
            this.categoryCode = new cinerino.service.CategoryCode(option);
            this.event = new cinerino.service.Event(option);
            this.offer = new cinerino.service.Offer(option);
            this.order = new cinerino.service.Order(option);
            this.seller = new cinerino.service.Seller(option);
            this.place = new cinerino.service.Place(option);
            this.person = new cinerino.service.Person(option);
            this.product = new cinerino.service.Product(option);
            this.project = new cinerino.service.Project({
                ...option,
                project: undefined,
            });
            this.ownershipInfo = new cinerino.service.person.OwnershipInfo(
                option
            );
            this.reservation = new cinerino.service.Reservation(option);
            this.payment = new cinerino.service.Payment(option);
            this.serviceOutput = new cinerino.service.ServiceOutput(option);
            this.token = new cinerino.service.Token(option);
            this.transaction = {
                placeOrder: new cinerino.service.transaction.PlaceOrder(option),
                returnOrder: new cinerino.service.transaction.ReturnOrder(
                    option
                ),
                moneyTransfer: new cinerino.service.transaction.MoneyTransfer(
                    option
                ),
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
            auth: this.auth,
            project: { id: Functions.Util.getProject().projectId },
        };
    }

    /**
     * @method authorize
     */
    public async authorize() {
        const data = (<Storage>(
            (<any>window)[this.environment.STORAGE_TYPE]
        )).getItem(this.environment.STORAGE_NAME);
        if (data === null) {
            throw new Error('state is null');
        }
        const state = JSON.parse(data);
        const url = '/api/authorize/getCredentials';
        const body = { member: '0' };
        if (state.App && state.App.userData.login) {
            body.member = '1';
        }
        if (
            this.auth !== undefined &&
            this.auth.credentials.expiryDate !== undefined &&
            body.member !== '1'
        ) {
            const now = (await this.utilservice.getServerTime()).date;
            const expiryDate = this.auth.credentials.expiryDate;
            const isTokenExpired =
                expiryDate !== undefined
                    ? moment(expiryDate).add(-5, 'minutes').unix() <=
                      moment(now).unix()
                    : false;
            if (!isTokenExpired) {
                // アクセストークン取得・更新しない
                return;
            }
        }
        // アクセストークン取得・更新
        const result = await this.http
            .post<{
                accessToken: string;
                expiryDate?: number;
                userName: string;
                clientId: string;
                endpoint: string;
                waiterServerUrl: string;
            }>(url, body)
            .toPromise();
        const option = {
            domain: '',
            clientId: result.clientId,
            redirectUri: '',
            logoutUri: '',
            responseType: '',
            scope: '',
            state: '',
            nonce: null,
            tokenIssuer: '',
        };
        this.auth = cinerino.createAuthInstance(option);
        this.auth.setCredentials({
            accessToken: result.accessToken,
            expiryDate: result.expiryDate,
        });
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
        location.href = result.url;
    }

    /**
     * サインアウト
     */
    public async signOut(params?: { logoutUrl?: string }) {
        if (params?.logoutUrl !== undefined) {
            sessionStorage.setItem('LOGOUT_URL', params.logoutUrl);
        }
        const url = '/api/authorize/signOut';
        const result = await this.http.get<any>(url, {}).toPromise();
        location.href = result.url;
    }

    /**
     * パスポート取得
     */
    public async getPassport(params: { scope: string }) {
        if (this.waiterServerUrl === undefined || this.waiterServerUrl === '') {
            return { token: '' };
        }
        const url = `${this.waiterServerUrl}/projects/${
            Functions.Util.getProject().projectId
        }/passports`;
        const body = { scope: params.scope };
        const result = await this.http
            .post<{ token: string }>(url, body)
            .toPromise();

        return result;
    }

    public async signIn2implicit() {
        const url = '/api/authorize/implicit';
        const result = await this.http
            .post<{
                clientId: string;
                domain: string;
                endpoint: string;
                waiterServerUrl: string;
            }>(url, {})
            .toPromise();
        const scopes: string[] = [];
        const options = {
            domain: result.domain,
            clientId: result.clientId,
            responseType: 'token',
            redirectUri: `${location.origin}/signIn`,
            logoutUri: `${location.origin}/signOut`,
            scope: scopes.join(' '),
            state: '',
            nonce: '',
            tokenIssuer: '',
        };
        const auth = cinerino.createAuthInstance(options);
        let credentials = await auth.isSignedIn();
        if (credentials === null) {
            credentials = await auth.signIn();
        }
        this.auth.setCredentials(credentials);
        this.endpoint = result.endpoint;
        this.waiterServerUrl = result.waiterServerUrl;
    }
}
