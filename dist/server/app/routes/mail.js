"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mail = require("../controllers/mail/mail.controller");
const router = express.Router();
router.post('/completeTemplate', mail.getCompleteTemplate);
router.post('/returnTemplate', mail.getReturnTemplate);
exports.default = router;
