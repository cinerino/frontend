import * as cinerino from '@cinerino/api-nodejs-client';

/**
 * 認証セッション
 * @interface IAuth2Session
 */
export interface IAuth2Session {
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
 * @class Auth2Model
 */
export class Auth2Model {
    /**
     * 状態（固定値）
     */
    private static STATE = 'STATE';
    /**
     * 検証コード（固定値）
     */
    private static CODE_VERIFIER = 'CODE_VERIFIER';
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
        // const resourceServerUrl  = <string>process.env.RESOURCE_SERVER_URL;
        this.scopes = [
            // 'phone',
            // 'openid',
            // 'email',
            // 'aws.cognito.signin.user.admin',
            // 'profile',
            // `${resourceServerUrl}/transactions`,
            // `${resourceServerUrl}/events.read-only`,
            // `${resourceServerUrl}/organizations.read-only`,
            // `${resourceServerUrl}/orders.read-only`,
            // `${resourceServerUrl}/places.read-only`,
            // `${resourceServerUrl}/people.contacts`,
            // `${resourceServerUrl}/people.creditCards`,
            // `${resourceServerUrl}/people.ownershipInfos.read-only`
        ];
        this.credentials = session.credentials;
        this.state = Auth2Model.STATE;
        this.codeVerifier = Auth2Model.CODE_VERIFIER;
    }

    /**
     * 認証クラス作成
     * @memberof Auth2Model
     * @method create
     * @returns {cinerino.auth.ClientCredentials}
     */
    public create(): cinerino.auth.OAuth2 {
        const auth = new cinerino.auth.OAuth2({
            domain: (<string>process.env.OAUTH2_SERVER_DOMAIN),
            clientId: (<string>process.env.CLIENT_ID_OAUTH2),
            clientSecret: (<string>process.env.CLIENT_SECRET_OAUTH2),
            redirectUri: (<string>process.env.AUTH_REDIRECT_URI),
            logoutUri: (<string>process.env.AUTH_LOGUOT_URI),
            state: this.state,
            scopes: <any>this.scopes.join(' ')
        });
        if (this.credentials !== undefined) {
            auth.setCredentials(this.credentials);
        }

        return auth;
    }

    /**
     * セッションへ保存
     * @memberof Auth2Model
     * @method save
     * @returns {Object}
     */
    public save(session: any): void {
        const authSession: IAuth2Session = {
            state: this.state,
            scopes: this.scopes,
            credentials: this.credentials,
            codeVerifier: this.codeVerifier
        };
        session.auth = authSession;
    }
}
