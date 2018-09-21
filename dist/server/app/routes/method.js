"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
// 発券方法説明
router.get('/ticketing', (_, res) => {
    res.render('method/ticketing');
});
exports.default = router;
