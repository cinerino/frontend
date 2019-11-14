/**
 * authorize
 */
import * as debug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { AuthModel } from '../../models/auth/auth.model';
import { Auth2Model } from '../../models/auth2/auth2.model';
import { errorProsess } from '../base/base.controller';
const log = debug('frontend:authorize');

export async function getCredentials(req: Request, res: Response) {
    log('getCredentials', req.body.member);
    try {
        let authModel;
        let userName;
        const endpoint = <string>process.env.API_ENDPOINT;
        const waiterServerUrl = <string>process.env.WAITER_SERVER_URL;
        if (req.body.member === '0') {
            authModel = new AuthModel();
        } else if (req.body.member === '1') {
            authModel = new Auth2Model((<Express.Session>req.session).auth);
        } else {
            throw new Error('member does not macth MemberType');
        }
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = await options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        if (req.body.member === '1') {
            userName = options.auth.verifyIdToken(<any>{}).getUsername();
        }
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, userName, clientId, endpoint, waiterServerUrl });
    } catch (err) {
        errorProsess(res, err);
    }
}


/**
 * サインイン処理
 * @param {Request} req
 * @param {Response} res
 */
export async function signIn(req: Request, res: Response) {
    log('signIn');
    if (req.session === undefined) {
        throw new Error('session is undefined');
    }
    delete req.session.auth;
    const authModel = new Auth2Model(req.session.auth);
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
}

/**
 * サインインリダイレクト処理
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function signInRedirect(req: Request, res: Response, next: NextFunction) {
    log('signInRedirect');
    try {
        if (req.session === undefined) {
            throw new Error('session is undefined');
        }
        const authModel = new Auth2Model(req.session.auth);
        if (req.query.state !== authModel.state) {
            throw (new Error(`state not matched ${req.query.state} !== ${authModel.state}`));
        }
        const auth = authModel.create();
        const credentials = await auth.getToken(
            req.query.code,
            <string>authModel.codeVerifier
        );
        // log('credentials published', credentials);

        authModel.credentials = credentials;
        authModel.save(req.session);

        auth.setCredentials(credentials);
        res.redirect('/#/auth/signin');
    } catch (err) {
        next(err);
    }
}

/**
 * サインアウト処理
 * @param {Request} req
 * @param {Response} res
 */
export async function signOut(req: Request, res: Response) {
    log('signOut');
    const authModel = new Auth2Model((<Express.Session>req.session).auth);
    const auth = authModel.create();
    const logoutUrl = auth.generateLogoutUrl();
    log('logoutUrl:', logoutUrl);
    res.json({
        url: logoutUrl
    });
}

/**
 * サインアウトリダイレクト処理
 * @param {Request} req
 * @param {Response} res
 */
export async function signOutRedirect(req: Request, res: Response) {
    log('signOutRedirect');
    delete (<Express.Session>req.session).auth;
    res.redirect('/#/auth/signout');
}
