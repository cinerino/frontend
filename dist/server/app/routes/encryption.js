"use strict";
/**
 * 暗号API
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const encryption = require("../controllers/encryption/encryption.controller");
const router = express.Router();
router.post('/encode', encryption.encode);
router.post('/decode', encryption.decode);
exports.default = router;
