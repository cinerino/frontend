"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorProsess = void 0;
/**
 * base
 */
const debug = require("debug");
const httpStatus = require("http-status");
const log = debug('application:base');
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
    res.json({ err: err, message: err.message, name: err.name, code: err.code });
}
exports.errorProsess = errorProsess;
