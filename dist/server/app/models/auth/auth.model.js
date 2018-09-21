"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cinerino = require("@cinerino/api-nodejs-client");
const uuid = require("uuid");
/**
 * 認証モデル
 * @class AuthModel
 */
class AuthModel {
    /**
     * @constructor
     * @param {any} session
     */
    constructor(session) {
        if (session === undefined) {
            session = {};
        }
        this.state = (session.state !== undefined) ? session.state : uuid.v1();
        const resourceServerUrl = process.env.RESOURCE_SERVER_URL;
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
    create() {
        return new cinerino.auth.ClientCredentials({
            domain: process.env.AUTHORIZE_SERVER_DOMAIN,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
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
exports.AuthModel = AuthModel;
