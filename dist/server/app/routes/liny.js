"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const liny = require("../controllers/liny/liny.controller");
const router = express.Router();
router.post('/sendMessage', liny.sendMessage);
exports.default = router;
