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
 * 購入
 */
const COA = require("@motionpicture/coa-service");
const mvtkReserve = require("@motionpicture/mvtk-reserve-service");
const sasaki = require("@motionpicture/sskts-api-nodejs-client");
const debug = require("debug");
const moment = require("moment");
const auth_model_1 = require("../../models/auth/auth.model");
const base_controller_1 = require("../base/base.controller");
const log = debug('SSKTS:purchase');
/**
 * 座席ステータス取得
 * @function getSeatState
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function getSeatState(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('getSeatState');
        try {
            const args = req.query;
            const result = yield COA.services.reserve.stateReserveSeat(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getSeatState = getSeatState;
/**
 * ムビチケチケットコード取得
 * @function mvtkTicketcode
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function mvtkTicketcode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('mvtkTicketcode');
        try {
            const args = req.body;
            const result = yield COA.services.master.mvtkTicketcode(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.mvtkTicketcode = mvtkTicketcode;
/**
 * ムビチケ照会
 * @function mvtkPurchaseNumberAuth
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function mvtkPurchaseNumberAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('mvtkPurchaseNumberAuth');
        try {
            const args = req.body;
            const result = yield mvtkReserve.services.auth.purchaseNumberAuth.purchaseNumberAuth(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.mvtkPurchaseNumberAuth = mvtkPurchaseNumberAuth;
/**
 * ムビチケ座席指定情報連携
 * @function mvtksSatInfoSync
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function mvtksSatInfoSync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('mvtksSatInfoSync');
        try {
            const args = req.body;
            const result = yield mvtkReserve.services.seat.seatInfoSync.seatInfoSync(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.mvtksSatInfoSync = mvtksSatInfoSync;
/**
 * スケジュールリスト取得
 * @memberof Purchase.PerformancesModule
 * @function getSchedule
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function getSchedule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = base_controller_1.getOptions(req);
            const args = {
                startFrom: req.query.startFrom,
                startThrough: req.query.startThrough
            };
            const theaters = yield new sasaki.service.Organization(options).searchMovieTheaters();
            const screeningEvents = yield sasaki.service.event(options).searchIndividualScreeningEvent(args);
            const checkedScreeningEvents = yield checkedSchedules({
                theaters: theaters,
                screeningEvents: screeningEvents
            });
            const result = {
                theaters: theaters,
                screeningEvents: checkedScreeningEvents
            };
            res.json({ result: result });
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getSchedule = getSchedule;
let coaSchedules = [];
coaSchedulesUpdate();
/**
 * COAスケジュール更新
 * @function coaSchedulesUpdate
 */
function coaSchedulesUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        log('coaSchedulesUpdate start', coaSchedules.length);
        try {
            const result = [];
            const authModel = new auth_model_1.AuthModel();
            const options = {
                endpoint: process.env.SSKTS_API_ENDPOINT,
                auth: authModel.create()
            };
            const theaters = yield sasaki.service.organization(options).searchMovieTheaters();
            const end = 5;
            for (const theater of theaters) {
                const scheduleArgs = {
                    theaterCode: theater.location.branchCode,
                    begin: moment().format('YYYYMMDD'),
                    end: moment().add(end, 'week').format('YYYYMMDD')
                };
                const schedules = yield COA.services.master.schedule(scheduleArgs);
                result.push({
                    theater: theater,
                    schedules: schedules
                });
            }
            coaSchedules = result;
            const upDateTime = 3600000; // 1000 * 60 * 60
            setTimeout(() => __awaiter(this, void 0, void 0, function* () { yield coaSchedulesUpdate(); }), upDateTime);
        }
        catch (err) {
            log(err);
            yield coaSchedulesUpdate();
        }
        log('coaSchedulesUpdate end', coaSchedules.length);
    });
}
/**
 * COAスケジュール更新待ち
 * @function waitCoaSchedulesUpdate
 */
function waitCoaSchedulesUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        const timer = 1000;
        const limit = 10000;
        let count = 0;
        return new Promise((resolve, reject) => {
            const check = setInterval(() => {
                if (count > limit) {
                    clearInterval(check);
                    reject();
                }
                if (coaSchedules.length > 0) {
                    clearInterval(check);
                    resolve();
                }
                count += 1;
            }, timer);
        });
    });
}
/**
 * スケジュール整合性確認
 * @function checkedSchedules
 */
function checkedSchedules(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (coaSchedules.length === 0) {
            yield waitCoaSchedulesUpdate();
        }
        const screeningEvents = [];
        for (const coaSchedule of coaSchedules) {
            for (const schedule of coaSchedule.schedules) {
                const id = [
                    coaSchedule.theater.location.branchCode,
                    schedule.titleCode,
                    schedule.titleBranchNum,
                    schedule.dateJouei,
                    schedule.screenCode,
                    schedule.timeBegin
                ].join('');
                const screeningEvent = args.screeningEvents.find((event) => {
                    return (event.identifier === id);
                });
                if (screeningEvent !== undefined) {
                    screeningEvents.push(screeningEvent);
                }
            }
        }
        // const diffList = diffScreeningEvents(args.screeningEvents, screeningEvents);
        // for (const diff of diffList) {
        //     log('diff', diff.identifier);
        // }
        // log('all length', screeningEvents.length + diffList.length);
        // log('screeningEvents length', screeningEvents.length);
        // log('diffList length', diffList.length);
        return screeningEvents;
    });
}
/**
 * 差分抽出
 * @function diffScreeningEvents
 * @param　{IEventWithOffer[]} array1
 * @param {IEventWithOffer[]} array2
 */
function diffScreeningEvents(array1, array2) {
    const diffArray = [];
    for (const array of array1) {
        const target = array2.find((event) => {
            return (event.identifier === array.identifier);
        });
        if (target === undefined) {
            diffArray.push(array);
        }
    }
    return diffArray;
}
exports.diffScreeningEvents = diffScreeningEvents;
