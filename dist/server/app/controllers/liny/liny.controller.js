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
 * liny
 */
const crypto = require("crypto");
const debug = require("debug");
const util_service_1 = require("../../services/util/util.service");
const log = debug('frontend:liny');
/**
 * メッセージ送信
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log('sendMessage');
            const secret = process.env.LINY_API_SECRET;
            const signature = crypto.createHmac('sha256', secret)
                .update(JSON.stringify(req.body))
                .digest('hex');
            const uri = `${process.env.LINY_API_ENDPOINT}/send_message`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYATSU-TOKEN': signature
                },
                json: req.body,
                method: 'POST'
            };
            const requestResult = yield util_service_1.requestAsync(uri, options);
            res.status(requestResult.response.statusCode);
            res.json(requestResult.body);
        }
        catch (error) {
            res.json({ error });
        }
    });
}
exports.sendMessage = sendMessage;
