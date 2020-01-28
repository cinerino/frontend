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
 * ルーティング
 */
const debug = require("debug");
const http_status_1 = require("http-status");
const path = require("path");
const auth2_model_1 = require("../models/auth2/auth2.model");
const authorize_1 = require("./api/authorize");
const liny_1 = require("./api/liny");
const util_1 = require("./api/util");
const log = debug('application: router');
exports.default = (app) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });
    app.use('/api/authorize', authorize_1.authorizeRouter);
    app.use('/api/liny', liny_1.linyRouter);
    app.use('/api', util_1.utilRouter);
    app.get('/signIn', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        log('signInRedirect');
        try {
            if (req.session === undefined) {
                throw new Error('session is undefined');
            }
            const authModel = new auth2_model_1.Auth2Model(req.session.auth);
            if (req.query.state !== authModel.state) {
                throw (new Error(`state not matched ${req.query.state} !== ${authModel.state}`));
            }
            const auth = authModel.create(req);
            const credentials = yield auth.getToken(req.query.code, authModel.codeVerifier);
            // log('credentials published', credentials);
            authModel.credentials = credentials;
            authModel.save(req.session);
            auth.setCredentials(credentials);
            res.redirect('/#/auth/signin');
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/signOut', (req, res) => {
        log('signOutRedirect');
        delete req.session.auth;
        res.redirect('/#/auth/signout');
    });
    app.get('*', (req, res, _next) => {
        if (req.xhr) {
            res.status(http_status_1.NOT_FOUND).json('NOT FOUND');
            return;
        }
        if (req.session !== undefined) {
            if (req.query.performanceId !== undefined && req.query.eventId === undefined) {
                req.query.eventId = req.query.performanceId;
            }
            req.session.external = req.query;
        }
        const dir = (process.env.NODE_ENV === 'production') ? 'production' : 'development';
        res.sendFile(path.resolve(`${__dirname}/../../../client/${dir}/index.html`));
    });
    app.all('*', (req, res, _next) => {
        res.status(http_status_1.NOT_FOUND);
        if (req.xhr) {
            res.json('NOT FOUND');
            return;
        }
        res.redirect('/#/error');
    });
};
