"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDebug = require("debug");
const http_status_1 = require("http-status");
const debug = createDebug('sskts-frontend:middlewares:ipFilter');
/**
 * IP制限ミドルウェア
 */
exports.default = (req, res, next) => {
    debug('x-forwarded-for:', req.headers['x-forwarded-for']);
    // IP制限拒否の場合
    if (process.env.SSKTS_ALLOWED_IPS !== undefined) {
        const allowedIps = process.env.SSKTS_ALLOWED_IPS.split(',');
        const forbidden = allowedIps.every((ip) => {
            const regex = new RegExp(`^${ip}(:\\d+)?$`);
            return !regex.test(req.headers['x-forwarded-for']);
        });
        // 許可IPリストのどれにも適合しなければ拒否
        if (forbidden) {
            res.status(http_status_1.FORBIDDEN).type('text').send('Forbidden');
            return;
        }
    }
    next();
};
