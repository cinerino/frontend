"use strict";
/**
 * API
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const http_status_1 = require("http-status");
const moment = require("moment");
const util_1 = require("../../functions/util");
const log = debug('application: /api/util');
const router = express.Router();
/**
 * プロジェクト設定取得
 */
router.post('/project', (req, res) => __awaiter(this, void 0, void 0, function* () {
    log('project', req.body.project);
    const project = (req.body.project);
    if (project === undefined) {
        res.json({
            projectId: process.env.PROJECT_ID,
            projectName: process.env.PROJECT_NAME,
            storageUrl: process.env.STORAGE_URL
        });
        return;
    }
    try {
        const findResult = util_1.getProject(project);
        if (findResult === undefined) {
            throw new Error('project not found');
        }
        res.json({
            projectId: findResult.PROJECT_ID,
            projectName: findResult.PROJECT_NAME,
            storageUrl: findResult.STORAGE_URL
        });
    }
    catch (error) {
        log('project', error.message);
        res.status(http_status_1.NOT_FOUND);
        res.json({ error: error.message });
    }
}));
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
exports.utilRouter = router;
