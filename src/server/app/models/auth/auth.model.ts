import * as cinerino from '@cinerino/api-nodejs-client';
import * as uuid from 'uuid';

/**
 * 認証セッション
 * @interface IAuthSession
 */
export interface IAuthSession {
    /**
     * 状態
     */
    state: string;
    /**
     * スコープ
     */
    scopes: string[];
    /**
     * 資格情報
     */
    credentials?: any;
    /**
     * コード検証
     */
    codeVerifier?: string;
}

/**
 * 認証モデル
 * @class AuthModel
 */
export class AuthModel {
    /**
     * 状態
     */
    public state: string;
    /**
     * スコープ
     */
    public scopes: string[];
    /**
     * 資格情報
     */
    public credentials?: any;
    /**
     * コード検証
     */
    public codeVerifier?: string;

    /**
     * @constructor
     * @param {any} session
     */
    constructor(session?: any) {
        if (session === undefined) {
            session = {};
        }
        this.state = (session.state !== undefined) ? session.state : uuid.v1();
        const resourceServerUrl  = <string>process.env.RESOURCE_SERVER_URL;
        this.scopes = (session.scopes !== undefined) ? session.scopes : [
            `${resourceServerUrl}/transactions`,
            `${resourceServerUrl}/events.read-only`,
            `${resourceServerUrl}/organizations.read-only`,
            `${resourceServerUrl}/orders.read-only`,
            `${resourceServerUrl}/places.read-only`
        ];
        this.credentials = session.credentials;
        this.codeVerifier = session.codeVerifier;
    }

    /**
     * 認証クラス作成
     * @memberof AuthModel
     * @method create
     * @returns {cinerino.auth.ClientCredentials}
     */
    public create(): cinerino.auth.ClientCredentials {
        return new cinerino.auth.ClientCredentials({
            domain: (<string>process.env.AUTHORIZE_SERVER_DOMAIN),
            clientId: (<string>process.env.CLIENT_ID),
            clientSecret: (<string>process.env.CLIENT_SECRET),
            state: this.state,
            scopes: this.scopes
        });
    }

    /**
     * セッションへ保存
     * @memberof AuthModel
     * @method save
     * @returns {Object}
     */
    public save(session: any): void {
        const authSession: IAuthSession = {
            state: this.state,
            scopes: this.scopes,
            credentials: this.credentials,
            codeVerifier: this.codeVerifier
        };
        session.auth = authSession;
    }
}
