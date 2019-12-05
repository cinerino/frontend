/**
 * base
 */
import * as debug from 'debug';
import { Response } from 'express';
import * as httpStatus from 'http-status';

const log = debug('application:base');

/**
 * エラー
 * @function error
 * @param {Response} res
 * @param {any} err
 */
export function errorProsess(res: Response, err: any) {
    log('errorProsess', err);
    if (err.code !== undefined) {
        res.status(err.code);
    } else {
        res.status(httpStatus.BAD_REQUEST);
    }
    res.json({ err: err, message: err.message, name: err.name, code: err.code });
}
