/**
 * base
 */

import * as debug from 'debug';
import { Response } from 'express';
import * as httpStatus from 'http-status';
// import { AuthModel } from '../../models/auth/auth.model';

const log = debug('frontend:base');

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
    res.json(err);
}
