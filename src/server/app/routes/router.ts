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
    app.use((req, res, next) => {
        if (/\.(css|js|svg|jpg|png|gif|ico|json|html|txt)/.test(req.path)) {
            res.status(404);
            res.end();
            return;
        }
        next();
    });

    app.use('/api/authorize', authorizeRouter);
    app.use('/api/liny', linyRouter);
    app.use('/api', utilRouter);

    app.use((req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            res.status(NOT_FOUND);
            res.send('NOT FOUND');
            return;
        }
        next();
    });

    app.get(
        '/signIn',
        async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            log('signInRedirect', req.query);
            if (req.query.code === undefined) {
                res.redirect('/default/html/signIn.html');
                return;
            }
            try {
                if (req.session === undefined) {
                    throw new Error('session is undefined');
                }
                const authModel = new Auth2Model(req.session.auth);
                if (
                    req.query.state !== undefined &&
                    req.query.state !== authModel.state
                ) {
                    throw new Error(
                        `state not matched ${req.query.state} !== ${authModel.state}`
                    );
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
        }
    );

    app.get('/signOut', (req: express.Request, res: express.Response) => {
        log('signOutRedirect');
        delete (<Express.Session>req.session).auth;
        res.redirect('/#/auth/signout');
    });

    app.get(
        ['/projects/:projectId', '/projects/:projectId/*'],
        (req, res, next) => {
            if (
                req.query.login === 'true' &&
                req.query.redirectUrl === undefined
            ) {
                const redirectUrl = Buffer.from(
                    req.url.replace('login=', 'login2=')
                ).toString('base64');
                res.redirect(`${req.url}&redirectUrl=${redirectUrl}`);
                return;
            }
            next();
        }
    );

    app.get(['/projects/:projectId/product/:productType'], (req, res) => {
        const productType = req.params.productType;
        res.redirect(`/?${getQueryParameter(req)}#/product/${productType}`);
    });

    app.get(
        [
            '/projects/:projectId/:projectName/inquiry',
            '/projects/:projectId/inquiry',
        ],
        (req, res) => {
            if (req.query.confirmationNumber === undefined) {
                res.redirect(`/?${getQueryParameter(req)}#/inquiry/input`);
                return;
            }
            res.redirect(
                `/?${getQueryParameter(req)}#/inquiry/input/${
                    req.query.confirmationNumber
                }`
            );
        }
    );

    app.get(
        [
            '/projects/:projectId/order/money/transfer',
            '/projects/:projectId/order/money/:theaterCode/transfer',
        ],
        (req, res) => {
            const theaterCode = req.params.theaterCode;
            if (theaterCode) {
                res.redirect(
                    `/?${getQueryParameter(
                        req
                    )}#/order/money/transfer/${theaterCode}/input`
                );
                return;
            }
            res.redirect(
                `/?${getQueryParameter(req)}#/order/money/transfer/input`
            );
        }
    );

    app.get(
        [
            '/projects/:projectId/purchase/transaction/:eventId/:passportToken',
            '/projects/:projectId/purchase/transaction/:eventId',
        ],
        (req, res) => {
            const eventId = req.params.eventId;
            const passportToken = req.params.passportToken;
            if (passportToken === undefined) {
                res.redirect(
                    `/?${getQueryParameter(
                        req
                    )}&eventId=${eventId}#/purchase/transaction`
                );
                return;
            }
            res.redirect(
                `/?${getQueryParameter(
                    req
                )}&eventId=${eventId}&passportToken=${passportToken}#/purchase/transaction`
            );
        }
    );

    app.get(
        ['/projects/:projectId/:projectName', '/projects/:projectId'],
        (req, res) => {
            res.redirect(`/?${getQueryParameter(req)}`);
        }
    );

    app.get('*', (req, res) => {
        if (req.session !== undefined) {
            if (
                req.query.performanceId !== undefined &&
                req.query.eventId === undefined
            ) {
                req.query.eventId = req.query.performanceId;
            }
            req.session.external = req.query;
        }
        res.sendFile(path.resolve(`${__dirname}/../../../client/index.html`), {
            lastModified: false,
            etag: false,
        });
    });
};

/**
 * クエリ取得
 */
function getQueryParameter(req: express.Request) {
    let result = `projectId=${req.params.projectId}`;
    if (
        req.params.projectName !== undefined &&
        req.params.projectName === 'print'
    ) {
        result += `&projectName=${req.params.projectName}`;
    }
    const query = req.url.split('?')[1];
    if (query !== undefined) {
        result += `&${query}`;
    }
    return result;
}
