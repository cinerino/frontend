"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 認証API
 */
const debug = require("debug");
const express = require("express");
const base_1 = require("../../functions/base");
const auth_model_1 = require("../../models/auth/auth.model");
const auth2_model_1 = require("../../models/auth2/auth2.model");
const router = express.Router();
const log = debug('application: /api/authorize');
/**
 * 認証情報取得
 */
router.post('/getCredentials', (req, res) => __awaiter(this, void 0, void 0, function* () {
    log('getCredentials', req.body.member);
    try {
        let authModel;
        let userName;
        const endpoint = process.env.API_ENDPOINT;
        const waiterServerUrl = process.env.WAITER_SERVER_URL;
        if (req.body.member === '0') {
            authModel = new auth_model_1.AuthModel();
        }
        else if (req.body.member === '1') {
            authModel = new auth2_model_1.Auth2Model(req.session.auth);
        }
        else {
            throw new Error('member does not macth MemberType');
        }
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = yield options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        if (req.body.member === '1') {
            userName = options.auth.verifyIdToken({}).getUsername();
        }
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, userName, clientId, endpoint, waiterServerUrl });
    }
    catch (error) {
        base_1.errorProsess(res, error);
    }
}));
router.get('/signIn', (req, res) => {
    log('signIn');
    if (req.session === undefined) {
        throw new Error('session is undefined');
    }
    delete req.session.auth;
    const authModel = new auth2_model_1.Auth2Model(req.session.auth);
    const auth = authModel.create();
    const url = auth.generateAuthUrl({
        scopes: authModel.scopes,
        state: authModel.state,
        codeVerifier: authModel.codeVerifier
    });
    delete req.session.auth;
    res.json({ url });
});
router.get('/signOut', (req, res) => {
    log('signOut');
    const authModel = new auth2_model_1.Auth2Model(req.session.auth);
    const auth = authModel.create();
    const url = auth.generateLogoutUrl();
    log('url:', url);
    res.json({ url });
});
exports.authorizeRouter = router;
