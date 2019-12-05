"use strict";
/**
 * API
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const http_status_1 = require("http-status");
const moment = require("moment");
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
        res.sendStatus(http_status_1.BAD_REQUEST);
        res.json({ error: 'session undefined' });
        return;
    }
    res.json((req.session.external === undefined) ? {} : req.session.external);
});
exports.utilRouter = router;
