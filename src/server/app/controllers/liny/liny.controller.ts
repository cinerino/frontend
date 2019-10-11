/**
 * liny
 */
import * as crypto from 'crypto';
import * as debug from 'debug';
import { Request, Response } from 'express';
import * as request from 'request';
import { requestAsync } from '../../services/util/util.service';
const log = debug('frontend:liny');


/**
 * メッセージ送信
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function sendMessage(req: Request, res: Response) {
    try {
        log('sendMessage');
        const secret = <string>process.env.LINY_API_SECRET;
        const signature = crypto.createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');
        const uri = `${process.env.LINY_API_ENDPOINT}`;
        const options: request.CoreOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-OYATSU-TOKEN': signature
            },
            json: req.body,
            method: 'POST'
        };
        const requestResult = await requestAsync<{ body: any, response: request.Response }>(uri, options);
        res.status(requestResult.response.statusCode);
        res.json(requestResult.body);
    } catch (error) {
        res.json({ error });
    }
}
