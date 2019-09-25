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
                .update(Buffer.from(JSON.stringify(req.body)))
                .digest('base64');
            const uri = `${process.env.LINY_API_ENDPOINT}/send_message`;
            const json = req.body;
            const headers = [
                { name: 'content-type', value: 'application/json' },
                { name: 'X-OYATSU-TOKEN', value: signature }
            ];
            const result = yield util_service_1.postRequestAsync(uri, { headers, json });
            log('sendMessage result', result);
            res.json(result);
        }
        catch (err) {
            log('sendMessage err', err);
            log('sendMessage err.message', err.message);
            res.json({ error: 'ERROR' });
        }
    });
}
exports.sendMessage = sendMessage;
