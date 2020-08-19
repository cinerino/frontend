"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const cinerino = require("@cinerino/sdk");
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
        this.scopes = [];
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
            domain: process.env.DOMAIN_CLIENT_CREDENTIALS,
            clientId: process.env.CLIENT_ID_CLIENT_CREDENTIALS,
            clientSecret: process.env.CLIENT_SECRET_CLIENT_CREDENTIALS,
            state: this.state,
            scopes: this.scopes
        });
    }
}
exports.AuthModel = AuthModel;
