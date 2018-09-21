"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 券種選択
 */
exports.default = (req) => {
    req.checkBody('reserveTickets', `${req.__('common.reserve_tickets')}${req.__('common.validation.required')}`).notEmpty();
    req.checkBody('reserveTickets', `${req.__('common.reserve_tickets')}${req.__('common.validation.is_json')}`).isJSON();
};
