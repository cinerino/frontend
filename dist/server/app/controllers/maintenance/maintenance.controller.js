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
 * maintenance
 */
const debug = require("debug");
const moment = require("moment");
const base_controller_1 = require("../base/base.controller");
const log = debug('sskts-ticket:maintenance');
function confirm(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('confirm');
        try {
            if (process.env.MAINTENANCE_TIME === undefined
                || process.env.MAINTENANCE_TIME === '') {
                res.json({
                    result: false,
                    maintenanceText: '',
                    startDate: '',
                    endDate: ''
                });
                return;
            }
            const maintenanceTime = process.env.MAINTENANCE_TIME.trim().split(',');
            const now = moment().unix();
            const start = moment(maintenanceTime[0]).unix();
            const end = moment(maintenanceTime[1]).unix();
            const maintenanceText = (process.env.MAINTENANCE_TEXT === undefined)
                ? ''
                : process.env.MAINTENANCE_TEXT;
            res.json({
                isMaintenance: (start < now && end > now),
                maintenanceText: new Buffer(maintenanceText, 'base64').toString(),
                startDate: maintenanceTime[0],
                endDate: maintenanceTime[1]
            });
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.confirm = confirm;
