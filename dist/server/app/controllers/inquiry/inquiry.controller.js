"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 照会
 */
const sasaki = require("@motionpicture/sskts-api-nodejs-client");
const debug = require("debug");
const http_status_1 = require("http-status");
const moment = require("moment");
const inquiry_model_1 = require("../../models/inquiry/inquiry.model");
const base_controller_1 = require("../base/base.controller");
const log = debug('SSKTS:inquiry');
/**
 * 照会表示
 * @function render
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('render');
        try {
            const inquiryModel = new inquiry_model_1.InquiryModel(req.session.inquiry);
            const options = base_controller_1.getOptions(req);
            const args = { branchCode: req.query.theater };
            log('findMovieTheaterByBranchCode', args);
            inquiryModel.movieTheaterOrganization = yield new sasaki.service.Organization(options).findMovieTheaterByBranchCode(args);
            inquiryModel.input.reserveNum = (req.query.reserve !== undefined) ? req.query.reserve : '';
            inquiryModel.save(req.session);
            res.locals.inquiryModel = inquiryModel;
            res.locals.error = null;
            res.render('inquiry/login');
            log('inquiryModel', inquiryModel);
        }
        catch (err) {
            log(err);
            res.locals.error = err;
            res.render('error/index');
        }
    });
}
exports.login = login;
/**
 * 照会
 * @function auth
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function auth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('auth');
        const options = base_controller_1.getOptions(req);
        const inquiryModel = new inquiry_model_1.InquiryModel(req.session.inquiry);
        try {
            loginForm(req);
            if (inquiryModel.movieTheaterOrganization === undefined) {
                throw new Error('movieTheaterOrganization is undefined');
            }
            const validationResult = yield req.getValidationResult();
            inquiryModel.input = {
                reserveNum: req.body.reserveNum,
                telephone: req.body.telephone
            };
            inquiryModel.save(req.session);
            if (validationResult.isEmpty()) {
                const theaterCode = inquiryModel.movieTheaterOrganization.location.branchCode;
                const args = {
                    telephone: inquiryModel.input.telephone,
                    confirmationNumber: Number(inquiryModel.input.reserveNum),
                    theaterCode: inquiryModel.movieTheaterOrganization.location.branchCode
                };
                log('findByOrderInquiryKey', args);
                inquiryModel.order = yield new sasaki.service.Order(options).findByOrderInquiryKey(args);
                log('findByOrderInquiryKey', inquiryModel.order);
                if (inquiryModel.order === undefined) {
                    log('NOT FOUND');
                    const error = {
                        code: 404,
                        errors: [{
                                name: 'SSKTSError',
                                reason: 'NotFound',
                                entityName: 'order',
                                message: 'Not Found: order.'
                            }]
                    };
                    throw error;
                }
                inquiryModel.save(req.session);
                const orderNumber = inquiryModel.order.orderNumber;
                return res.redirect(`/inquiry/confirm/${orderNumber}/?theater=${theaterCode}`);
            }
            else {
                res.locals.inquiryModel = inquiryModel;
                res.locals.error = validationResult.mapped();
                res.render('inquiry/login');
                return;
            }
        }
        catch (err) {
            log(err);
            if (err.code !== undefined && err.code === http_status_1.NOT_FOUND) {
                res.locals.inquiryModel = inquiryModel;
                res.locals.error = getInquiryError(req);
                return res.render('inquiry/login');
            }
            res.locals.error = err;
            res.render('error/index');
        }
    });
}
exports.auth = auth;
/**
 * 照会確認表示
 * @function confirm
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function confirm(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('confirm');
        if (req.session === undefined || req.session.inquiry === undefined) {
            const orderNumber = req.params.orderNumber;
            const theaterCode = req.query.theater;
            return res.redirect(`/inquiry/login?orderNumber=${orderNumber}&theater=${theaterCode}`);
        }
        const inquiryModel = new inquiry_model_1.InquiryModel(req.session.inquiry);
        res.locals.inquiryModel = inquiryModel;
        res.locals.moment = moment;
        res.locals.timeFormat = timeFormat;
        delete req.session.inquiry;
        res.render('inquiry/confirm');
    });
}
exports.confirm = confirm;
/**
 * 購入者情報入力フォーム
 */
function loginForm(req) {
    const minLength = 9;
    req.checkBody('reserveNum', `${req.__('common.purchaseNumber')}${req.__('common.validation.required')}`).notEmpty();
    req.checkBody('reserveNum', `${req.__('common.purchaseNumber')}${req.__('common.validation.isNumber')}`).matches(/^[0-9]+$/);
    req.checkBody('telephone', `${req.__('common.telNum')}${req.__('common.validation.required')}`).notEmpty();
    req.checkBody('telephone', `${req.__('common.telNum')}${req.__('common.validation.isNumber')}`).matches(/^[0-9]+$/);
    req.checkBody('telephone', `${req.__('common.telNum')}${req.__('common.validation.minlength %s', String(minLength))}`).isLength({
        min: minLength
    });
}
/**
 * 照会エラー取得
 * @function getInquiryError
 * @param {Request} req
 * @returns {any}
 */
function getInquiryError(req) {
    return {
        reserveNum: {
            parm: 'reserveNum',
            msg: `${req.__('common.purchaseNumber')}${req.__('common.validation.inquiry')}`,
            value: ''
        },
        telephone: {
            parm: 'telephone',
            msg: `${req.__('common.telNum')}${req.__('common.validation.inquiry')}`,
            value: ''
        }
    };
}
/**
 * 時間フォーマット
 * @function timeFormat
 * @param {string} referenceDate 基準日
 * @param {Date} screeningTime 時間
 * @returns {string}
 */
function timeFormat(screeningTime, referenceDate) {
    const DIGITS = -2;
    const HOUR = 60;
    const diff = moment(screeningTime).diff(moment(referenceDate), 'minutes');
    const hour = (`00${Math.floor(diff / HOUR)}`).slice(DIGITS);
    const minutes = moment(screeningTime).format('mm');
    return `${hour}:${minutes}`;
}
