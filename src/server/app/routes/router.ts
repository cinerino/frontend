/**
 * ルーティング
 */
import * as debug from 'debug';
import * as express from 'express';
import { NOT_FOUND } from 'http-status';
import * as path from 'path';
import { Auth2Model } from '../models/auth2/auth2.model';
import { authorizeRouter } from './api/authorize';
import { linyRouter } from './api/liny';
import { utilRouter } from './api/util';
const log = debug('application: router');

export default (app: express.Application) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });

    app.use('/api/authorize', authorizeRouter);
    app.use('/api/liny', linyRouter);
    app.use('/api', utilRouter);

    app.get('/signIn', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        log('signInRedirect');
        try {
            if (req.session === undefined) {
                throw new Error('session is undefined');
            }
            const authModel = new Auth2Model(req.session.auth);
            if (req.query.state !== authModel.state) {
                throw (new Error(`state not matched ${req.query.state} !== ${authModel.state}`));
            }
            const auth = authModel.create(req);
            const credentials = await auth.getToken(
                req.query.code,
                <string>authModel.codeVerifier
            );
            // log('credentials published', credentials);
            authModel.credentials = credentials;
            authModel.save(req.session);
            auth.setCredentials(credentials);
            res.redirect('/#/auth/signin');
        } catch (error) {
            next(error);
        }
    });

    app.get('/signOut', (req: express.Request, res: express.Response) => {
        log('signOutRedirect');
        delete (<Express.Session>req.session).auth;
        res.redirect('/#/auth/signout');
    });

    app.get('*', (req, res, _next) => {
        if (req.xhr) {
            res.status(NOT_FOUND).json('NOT FOUND');
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
        res.status(NOT_FOUND);
        if (req.xhr) {
            res.json('NOT FOUND');
            return;
        }
        res.redirect('/#/error');
    });
};
