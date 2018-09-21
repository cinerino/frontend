"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ムビチケ認証
 */
exports.default = (req) => {
    req.checkBody('mvtk', `${req.__('common.mvtk')}${req.__('common.validation.required')}`).notEmpty();
    req.checkBody('mvtk', `${req.__('common.mvtk')}${req.__('common.validation.is_json')}`).isJSON();
};
