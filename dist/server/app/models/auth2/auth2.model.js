"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cinerino = require("@cinerino/api-nodejs-client");
/**
 * 認証モデル
 * @class Auth2Model
 */
class Auth2Model {
    /**
     * @constructor
     * @param {any} session
     */
    constructor(session) {
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
    create() {
        const auth = new cinerino.auth.OAuth2({
            domain: process.env.OAUTH2_SERVER_DOMAIN,
            clientId: process.env.CLIENT_ID_OAUTH2,
            clientSecret: process.env.CLIENT_SECRET_OAUTH2,
            redirectUri: process.env.AUTH_REDIRECT_URI,
            logoutUri: process.env.AUTH_LOGUOT_URI,
            state: this.state,
            scopes: this.scopes.join(' ')
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
    save(session) {
        const authSession = {
            state: this.state,
            scopes: this.scopes,
            credentials: this.credentials,
            codeVerifier: this.codeVerifier
        };
        session.auth = authSession;
    }
}
/**
 * 状態（固定値）
 */
Auth2Model.STATE = 'STATE';
/**
 * 検証コード（固定値）
 */
Auth2Model.CODE_VERIFIER = 'CODE_VERIFIER';
exports.Auth2Model = Auth2Model;
