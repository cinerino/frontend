/**
 * 認証API
 */
import * as debug from 'debug';
import * as express from 'express';
import { errorProsess } from '../../functions/base';
import { AuthModel } from '../../models/auth/auth.model';
import { Auth2Model } from '../../models/auth2/auth2.model';
const router = express.Router();
const log = debug('application: /api/authorize');

/**
 * 認証情報取得
 */
router.post('/getCredentials', async (req, res) => {
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
    } catch (error) {
        errorProsess(res, error);
    }
});

router.get('/signIn', (req, res) => {
    log('signIn');
    if (req.session === undefined) {
        throw new Error('session is undefined');
    }
    delete req.session.auth;
    const authModel = new Auth2Model(req.session.auth);
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
    const authModel = new Auth2Model((<Express.Session>req.session).auth);
    const auth = authModel.create();
    const url = auth.generateLogoutUrl();
    log('url:', url);
    res.json({ url });
});

export const authorizeRouter = router;
