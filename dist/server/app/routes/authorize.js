"use strict";
/**
 * ルーティングAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authorize = require("../controllers/authorize/authorize.controller");
const router = express.Router();
router.post('/getCredentials', authorize.getCredentials);
router.get('/signIn', authorize.signIn);
router.get('/signOut', authorize.signOut);
exports.default = router;
