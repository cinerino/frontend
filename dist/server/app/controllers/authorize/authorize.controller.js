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
 * authorize
 */
const debug = require("debug");
const auth_model_1 = require("../../models/auth/auth.model");
const auth2_model_1 = require("../../models/auth2/auth2.model");
const base_controller_1 = require("../base/base.controller");
const log = debug('frontend:authorize');
function getCredentials(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('getCredentials');
        try {
            let authModel;
            let userName;
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
                endpoint: process.env.SSKTS_API_ENDPOINT,
                auth: authModel.create()
            };
            const accessToken = yield options.auth.getAccessToken();
            if (req.body.member === '1') {
                userName = options.auth.verifyIdToken({}).getUsername();
            }
            const credentials = {
                accessToken: accessToken,
                userName: userName
            };
            res.json(credentials);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getCredentials = getCredentials;
/**
 * サインイン処理
 * @param {Request} req
 * @param {Response} res
 */
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('signIn');
        if (req.session === undefined) {
            throw new Error('session is undefined');
        }
        delete req.session.auth;
        const authModel = new auth2_model_1.Auth2Model(req.session.auth);
        const auth = authModel.create();
        const authUrl = auth.generateAuthUrl({
            scopes: authModel.scopes,
            state: authModel.state,
            codeVerifier: authModel.codeVerifier
        });
        delete req.session.auth;
        res.json({
            url: authUrl
        });
    });
}
exports.signIn = signIn;
/**
 * サインインリダイレクト処理
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function signInRedirect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        log('signInRedirect');
        try {
            if (req.session === undefined) {
                throw new Error('session is undefined');
            }
            const authModel = new auth2_model_1.Auth2Model(req.session.auth);
            if (req.query.state !== authModel.state) {
                throw (new Error(`state not matched ${req.query.state} !== ${authModel.state}`));
            }
            const auth = authModel.create();
            const credentials = yield auth.getToken(req.query.code, authModel.codeVerifier);
            // log('credentials published', credentials);
            authModel.credentials = credentials;
            authModel.save(req.session);
            auth.setCredentials(credentials);
            res.redirect('/#/auth/signin');
        }
        catch (err) {
            next(err);
        }
    });
}
exports.signInRedirect = signInRedirect;
/**
 * サインアウト処理
 * @param {Request} req
 * @param {Response} res
 */
function signOut(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('signOut');
        const authModel = new auth2_model_1.Auth2Model(req.session.auth);
        const auth = authModel.create();
        const logoutUrl = auth.generateLogoutUrl();
        log('logoutUrl:', logoutUrl);
        res.json({
            url: logoutUrl
        });
    });
}
exports.signOut = signOut;
/**
 * サインアウトリダイレクト処理
 * @param {Request} req
 * @param {Response} res
 */
function signOutRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('signOutRedirect');
        delete req.session.auth;
        res.redirect('/#/auth/signout');
    });
}
exports.signOutRedirect = signOutRedirect;
