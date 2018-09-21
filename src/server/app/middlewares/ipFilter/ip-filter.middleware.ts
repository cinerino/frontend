import * as createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { FORBIDDEN } from 'http-status';

const debug = createDebug('sskts-frontend:middlewares:ipFilter');

/**
 * IP制限ミドルウェア
 */
export default (req: Request, res: Response, next: NextFunction) => {
    debug('x-forwarded-for:', req.headers['x-forwarded-for']);

    // IP制限拒否の場合
    if (process.env.SSKTS_ALLOWED_IPS !== undefined) {
        const allowedIps = (<string>process.env.SSKTS_ALLOWED_IPS).split(',');
        const forbidden = allowedIps.every((ip) => {
            const regex = new RegExp(`^${ip}(:\\d+)?$`);

            return !regex.test((<string>req.headers['x-forwarded-for']));
        });

        // 許可IPリストのどれにも適合しなければ拒否
        if (forbidden) {
            res.status(FORBIDDEN).type('text').send('Forbidden');

            return;
        }
    }

    next();
};
