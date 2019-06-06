"use strict";
/**
 * 多言語
 */
Object.defineProperty(exports, "__esModule", { value: true });
const i18n = require("i18n");
const directory = `${__dirname}/../../locales`;
i18n.configure({
    locales: ['ja'],
    defaultLocale: 'ja',
    directory: directory,
    objectNotation: true,
    updateFiles: false // ページのビューで自動的に言語ファイルを更新しない
});
/**
 * 言語セット
 * @function setLocale
 * @param {Request} req
 * @param {res} res
 * @param {NextFunction} next
 */
function setLocale(req, res, next) {
    i18n.init(req, res, next);
    if (req.session !== undefined && req.session.locale !== undefined) {
        i18n.setLocale(req, req.session.locale);
    }
    else {
        i18n.setLocale(req, 'ja');
    }
}
exports.setLocale = setLocale;
