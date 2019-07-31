"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const moment = require("moment");
const path = require("path");
const authorize = require("../controllers/authorize/authorize.controller");
const mail = require("../controllers/mail/mail.controller");
const authorize_1 = require("./authorize");
const encryption_1 = require("./encryption");
exports.default = (app) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });
    app.use('/storage', (req, res) => {
        const url = req.originalUrl.replace('/storage', process.env.STORAGE_URL);
        res.redirect(url);
    });
    app.use('/api/authorize', authorize_1.default);
    app.use('/api/encryption', encryption_1.default);
    app.get('/api/storage', (_req, res) => { res.json({ storage: process.env.STORAGE_URL }); });
    app.get('/api/serverTime', (_req, res) => { res.json({ date: moment().toISOString() }); });
    app.post('/api/external', (req, res) => {
        if (req.session === undefined) {
            res.sendStatus(http_status_1.BAD_REQUEST);
            res.json({ error: 'session undefined' });
            return;
        }
        res.json((req.session.external === undefined) ? {} : req.session.external);
    });
    app.post('/api/mail/template', mail.getTemplate);
    app.get('/signIn', authorize.signInRedirect);
    app.get('/signOut', authorize.signOutRedirect);
    app.get('*', (req, res, _next) => {
        if (req.xhr) {
            res.status(httpStatus.NOT_FOUND).json('NOT FOUND');
            return;
        }
        if (req.session !== undefined) {
            req.session.external = req.query;
        }
        const dir = (process.env.NODE_ENV === 'production') ? 'production' : 'development';
        res.sendFile(path.resolve(`${__dirname}/../../../client/${dir}/index.html`));
    });
    app.all('*', (req, res, _next) => {
        res.status(httpStatus.NOT_FOUND);
        if (req.xhr) {
            res.json('NOT FOUND');
            return;
        }
        res.redirect('/#/error');
    });
};
