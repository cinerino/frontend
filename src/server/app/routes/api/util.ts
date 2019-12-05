/**
 * API
 */

import * as debug from 'debug';
import * as express from 'express';
import { BAD_REQUEST } from 'http-status';
import * as moment from 'moment';
const log = debug('application: /api/util');
const router = express.Router();

/**
 * ストレージURL取得
 */
router.get('/storage', (_req, res) => {
    log('storage');
    res.json({ storage: process.env.STORAGE_URL });
});

/**
 * サーバータイム取得
 */
router.get('/api/serverTime', (_req, res) => {
    log('serverTime');
    res.json({ date: moment().toISOString() });
});

/**
 * 外部連携情報取得
 */
router.post('/api/external', (req, res) => {
    log('external');
    if (req.session === undefined) {
        res.sendStatus(BAD_REQUEST);
        res.json({ error: 'session undefined' });
        return;
    }
    res.json((req.session.external === undefined) ? {} : req.session.external);
});

export const utilRouter = router;
