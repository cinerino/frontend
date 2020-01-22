/**
 * API
 */

import * as debug from 'debug';
import * as express from 'express';
import { NOT_FOUND } from 'http-status';
import * as moment from 'moment';
import { getProject } from '../../functions/util';
const log = debug('application: /api/util');
const router = express.Router();

/**
 * プロジェクト設定取得
 */
router.post('/project', async (req, res) => {
    log('project', req.body.project);
    const project = <string | undefined>(req.body.project);
    if (project === undefined) {
        res.json({
            projectId: process.env.PROJECT_ID,
            projectName: process.env.PROJECT_NAME,
            storageUrl: process.env.STORAGE_URL
        });
        return;
    }
    try {
        const findResult = getProject(project);
        if (findResult === undefined) {
            throw new Error('project not found');
        }
        res.json({
            projectId: findResult.PROJECT_ID,
            projectName: findResult.PROJECT_NAME,
            storageUrl: findResult.STORAGE_URL
        });
    } catch (error) {
        log('project', error.message);
        res.status(NOT_FOUND);
        res.json({ error: error.message });
    }
});

/**
 * サーバータイム取得
 */
router.get('/serverTime', (_req, res) => {
    log('serverTime');
    res.json({ date: moment().toISOString() });
});

/**
 * バージョン取得
 */
router.get('/version', (_req, res) => {
    log('version');
    res.json({ version: process.env.VERSION });
});

export const utilRouter = router;
