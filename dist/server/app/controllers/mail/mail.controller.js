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
 * mail
 */
const api_nodejs_client_1 = require("@cinerino/api-nodejs-client");
const debug = require("debug");
const ejs = require("ejs");
const libphonenumber = require("libphonenumber-js");
const momentTimezone = require("moment-timezone");
const request = require("request");
const base_controller_1 = require("../base/base.controller");
const log = debug('frontend:mail');
function getTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('getTemplate');
        try {
            const view = yield requestAsync(`${process.env.STORAGE_URL}${req.body.view}`);
            momentTimezone.tz('Asia/Tokyo');
            const template = yield ejs.render(view, Object.assign({}, req.body, { moment: momentTimezone, formatTelephone, getTicketPrice }), { async: true });
            res.json({ template });
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getTemplate = getTemplate;
function getReturnTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        log('getReturnTemplate');
        try {
            const view = yield requestAsync(`${process.env.STORAGE_URL}/ejs/mail/return.ejs`);
            momentTimezone.tz('Asia/Tokyo');
            const template = yield ejs.render(view, Object.assign({}, req.body, { moment: momentTimezone, formatTelephone, getTicketPrice }), { async: true });
            res.json({ template });
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getReturnTemplate = getReturnTemplate;
function requestAsync(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            request.get(url, options, (error, _response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(body);
            });
        });
    });
}
/**
 * 電話番号変換
 */
function formatTelephone(telephone, format) {
    if (telephone === undefined) {
        return '';
    }
    const parseNumber = libphonenumber.parse(telephone, 'JP');
    format = (format === undefined) ? 'International' : format;
    return libphonenumber.format(parseNumber, format).replace(/\s/g, '');
}
exports.formatTelephone = formatTelephone;
/**
 * 券種金額取得
 */
function getTicketPrice(ticket) {
    const result = {
        unitPriceSpecification: 0,
        videoFormatCharge: 0,
        soundFormatCharge: 0,
        movieTicketTypeCharge: 0,
        total: 0,
        single: 0
    };
    if (ticket.priceSpecification === undefined) {
        return result;
    }
    const priceComponent = ticket.priceSpecification.priceComponent;
    const priceSpecificationType = api_nodejs_client_1.factory.chevre.priceSpecificationType;
    const unitPriceSpecifications = priceComponent.filter((s) => s.typeOf === priceSpecificationType.UnitPriceSpecification);
    const videoFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.VideoFormatChargeSpecification);
    const soundFormatCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.SoundFormatChargeSpecification);
    const movieTicketTypeCharges = priceComponent.filter((s) => s.typeOf === priceSpecificationType.MovieTicketTypeChargeSpecification);
    result.unitPriceSpecification += unitPriceSpecifications[0].price;
    videoFormatCharges.forEach((videoFormatCharge) => {
        result.videoFormatCharge += videoFormatCharge.price;
    });
    soundFormatCharges.forEach((soundFormatCharge) => {
        result.soundFormatCharge += soundFormatCharge.price;
    });
    movieTicketTypeCharges.forEach((movieTicketTypeCharge) => {
        result.movieTicketTypeCharge += movieTicketTypeCharge.price;
    });
    result.total = result.unitPriceSpecification + result.videoFormatCharge + result.soundFormatCharge + result.movieTicketTypeCharge;
    const unitPriceSpecification = unitPriceSpecifications[0];
    if (unitPriceSpecification.typeOf === priceSpecificationType.UnitPriceSpecification) {
        const referenceQuantityValue = (unitPriceSpecification.referenceQuantity.value === undefined)
            ? 1
            : unitPriceSpecification.referenceQuantity.value;
        result.single = result.total / referenceQuantityValue;
    }
    return result;
}
exports.getTicketPrice = getTicketPrice;
