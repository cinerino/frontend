"use strict";
/**
 * セッション
 */
Object.defineProperty(exports, "__esModule", { value: true });
const connectRedis = require("connect-redis");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST, {
    password: process.env.REDIS_KEY,
    tls: {
        servername: process.env.REDIS_HOST
    },
    return_buffers: true
});
const sessionStore = new (connectRedis(session))({ client: redisClient });
exports.default = session({
    secret: 'frontend-session-secret',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: (process.env.SESSION_COOKIE_MAX_AGE === undefined
            || process.env.SESSION_COOKIE_MAX_AGE === '')
            ? 604800000 : Number(process.env.SESSION_COOKIE_MAX_AGE)
    }
});
