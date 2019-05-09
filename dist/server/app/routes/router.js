"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorize = require("../controllers/authorize/authorize.controller");
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
    app.get('/signIn', authorize.signInRedirect);
    app.get('/signOut', authorize.signOutRedirect);
    app.get('*', (req, res, _next) => {
        if (req.xhr) {
            res.status(httpStatus.NOT_FOUND).json('NOT FOUND');
            return;
        }
        res.sendFile(path.resolve(`${__dirname}/../../../client/${process.env.NODE_ENV}/index.html`));
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
