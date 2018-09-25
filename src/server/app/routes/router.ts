/**
 * ルーティング
 */
import * as express from 'express';
import * as path from 'path';
import * as authorize from '../controllers/authorize/authorize.controller';
import authorizeRouter from './authorize';

export default (app: express.Application) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });

    app.use('/api/authorize', authorizeRouter);

    app.get('/signIn', authorize.signInRedirect);
    app.get('/signIn', authorize.signOutRedirect);

    app.get('*', (_req, res, _next) => {
        res.sendFile(path.resolve(`${__dirname}/../../../client/index.html`));
    });
};
