"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorize = require("../controllers/authorize/authorize.controller");
const authorize_1 = require("./authorize");
exports.default = (app) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });
    app.use('/api/authorize', authorize_1.default);
    app.get('/signIn', authorize.signInRedirect);
    app.get('/signIn', authorize.signOutRedirect);
    app.get('*', (_req, res, _next) => {
        res.sendFile(path.resolve(`${__dirname}/../../../client/index.html`));
    });
};
