/**
 * liny
 */
import * as crypto from 'crypto';
import * as debug from 'debug';
import { Request, Response } from 'express';
import { postRequestAsync } from '../../services/util/util.service';
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
            .update(Buffer.from(JSON.stringify(req.body)))
            .digest('base64');
        const uri = `${process.env.LINY_API_ENDPOINT}/send_message`;
        const json = req.body;
        const headers = [
            { name: 'content-type', value: 'application/json' },
            { name: 'X-OYATSU-TOKEN', value: signature }
        ];
        const result = await postRequestAsync<string>(uri, { headers, json });
        log('sendMessage result', result);
        res.json(result);
    } catch (err) {
        log('sendMessage err', err);
        log('sendMessage err.message', err.message);
        res.json({ error: 'ERROR' });
    }
}
