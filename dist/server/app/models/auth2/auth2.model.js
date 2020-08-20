"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth2Model = void 0;
const cinerino = require("@cinerino/sdk");
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
        this.scopes = [];
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
    create(req) {
        const auth = new cinerino.auth.OAuth2({
            domain: process.env.AUTHORIZATION_CODE_DOMAIN,
            clientId: process.env.AUTHORIZATION_CODE_CLIENT_ID,
            clientSecret: process.env.AUTHORIZATION_CODE_CLIENT_SECRET,
            redirectUri: `${req.protocol}://${req.hostname}/signIn`,
            logoutUri: `${req.protocol}://${req.hostname}/signOut`,
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
exports.Auth2Model = Auth2Model;
/**
 * 状態（固定値）
 */
Auth2Model.STATE = 'STATE';
/**
 * 検証コード（固定値）
 */
Auth2Model.CODE_VERIFIER = 'CODE_VERIFIER';
