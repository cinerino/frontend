"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const master = require("../controllers/master/master.controller");
const router = express.Router();
router.get('/getSalesTickets', master.getSalesTickets);
exports.default = router;
