/**
 * 暗号API
 */
import * as crypto from 'crypto-js';
import * as debug from 'debug';
import * as express from 'express';
import { BAD_REQUEST } from 'http-status';
const router = express.Router();
const log = debug('application: /api/encryption');

/**
 * エンコード
 */
router.post('/encode', (req, res) => {
    log('encode', req.body);
    try {
        if (process.env.ENCYPT_KEY === undefined) {
            throw new Error('ENCYPT_KEY is undefined');
        }
        // UTF-8エンコーディング
        const encyptKey = crypto.enc.Utf8.parse(process.env.ENCYPT_KEY);
        // パスワードsalt
        const salt = crypto.lib.WordArray.random(128 / 8);
        const keySize = 128 / 8;
        const iterations = 500;
        const key128Bits500Iterations = crypto.PBKDF2(encyptKey, salt, { keySize, iterations });
        // // 初期化ベクトル(IV)
        const iv = crypto.lib.WordArray.random(128 / 8);
        // オプション（IV:初期化ベクトル, CBCモード, パディングモード：PKCS7)
        const options = {
            iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        };
        // UTF-8エンコーディング
        const encyptText = crypto.enc.Utf8.parse(req.body.encyptText);
        // 暗号化
        const encrypted = crypto.AES.encrypt(encyptText, key128Bits500Iterations, options).toString();
        res.json({
            salt: crypto.enc.Hex.stringify(salt),
            iv: crypto.enc.Hex.stringify(iv),
            encrypted
        });
    } catch (error) {
        log('error', error);
        res.status(BAD_REQUEST);
        res.json({ error });
    }

});

/**
 * デコード
 */
router.post('/decode', (req, res) => {
    log('encode', req.body);
    try {
        if (process.env.ENCYPT_KEY === undefined) {
            throw new Error('ENCYPT_KEY is undefined');
        }
        if (req.body.salt === undefined || req.body.iv === undefined) {
            throw new Error('ENCYPT_KEY is undefined');
        }
        // パスワードsalt
        const salt = crypto.enc.Hex.parse(req.body.salt);
        // 初期化ベクトル(IV)
        const iv = crypto.enc.Hex.parse(req.body.iv);
        // 暗号化データ
        const encrypted = crypto.enc.Base64.parse(req.body.encrypted);
        // パスワード（鍵空間の定義）
        const encyptKey = crypto.enc.Utf8.parse(process.env.ENCYPT_KEY);
        const keySize = 128 / 8;
        const iterations = 500;
        const key128Bits500Iterations = crypto.PBKDF2(encyptKey, salt, { keySize, iterations });
        // オプション（IV:初期化ベクトル, CBCモード, パディングモード：PKCS7)
        const options = {
            iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        };
        // 復号
        const decrypted = crypto.AES.decrypt(<any>{ ciphertext: encrypted }, key128Bits500Iterations, options);
        res.json({ decrypted: decrypted.toString(crypto.enc.Utf8) });
    } catch (error) {
        log('error', error);
        res.status(httpStatus.BAD_REQUEST);
        res.json({ error });
    }
});

export const encryptionRouter = router;
