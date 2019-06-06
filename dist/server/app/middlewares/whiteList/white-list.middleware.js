"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクセス許可
 */
const debug = require("debug");
const log = debug('sskts-ticket:middlewares:whiteList');
/**
 * アクセス許可ミドルウェア
 *
 * @module whiteList
 */
exports.default = (req, res, next) => {
    if (process.env.WHITELIST !== undefined) {
        const whiteList = process.env.WHITELIST.replace(/\s+/g, '').split(',');
        const requestUrl = req.get('Origin');
        const allowOrigin = whiteList.find((value) => (value === requestUrl));
        if (allowOrigin !== undefined) {
            res.setHeader('Access-Control-Allow-Origin', allowOrigin);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('X-Frame-Options', `ALLOW-FROM ${allowOrigin}`);
            res.setHeader('Content-Security-Policy', `frame-ancestors ${allowOrigin}`);
            log('whiteList', allowOrigin);
        }
    }
    next();
};
