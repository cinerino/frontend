"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const coa = require("../controllers/coa/coa.controller");
const router = express.Router();
router.get('/getSeatState', coa.getSeatState);
router.get('/getSalesTickets', coa.getSalesTickets);
exports.default = router;
