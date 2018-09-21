"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const purchase = require("../controllers/purchase/purchase.controller");
const router = express.Router();
router.get('/getSeatState', purchase.getSeatState);
router.post('/mvtkTicketcode', purchase.mvtkTicketcode);
router.post('/mvtkPurchaseNumberAuth', purchase.mvtkPurchaseNumberAuth);
router.post('/mvtksSatInfoSync', purchase.mvtksSatInfoSync);
router.post('/getSchedule', purchase.getSchedule);
exports.default = router;
