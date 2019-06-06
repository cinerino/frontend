"use strict";
/**
 * base
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const httpStatus = require("http-status");
// import { AuthModel } from '../../models/auth/auth.model';
const log = debug('frontend:base');
/**
 * エラー
 * @function error
 * @param {Response} res
 * @param {any} err
 */
function errorProsess(res, err) {
    log('errorProsess', err);
    if (err.code !== undefined) {
        res.status(err.code);
    }
    else {
        res.status(httpStatus.BAD_REQUEST);
    }
    res.json(err);
}
exports.errorProsess = errorProsess;
