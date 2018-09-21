"use strict";
/**
 * ベンチマーク
 */
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const log = debug('frontend:benchmark');
exports.default = (req, _, next) => {
    if (process.env.NODE_ENV === 'development') {
        const startMemory = process.memoryUsage();
        const startTime = process.hrtime();
        req.on('end', () => {
            const endMemory = process.memoryUsage();
            const memoryUsage = endMemory.rss - startMemory.rss;
            const diff = process.hrtime(startTime);
            const memory = `${startMemory.rss} - ${endMemory.rss}`;
            log(`benchmark took ${diff[0]} seconds and ${diff[1]} nanoseconds. memoryUsage:${memoryUsage} (${memory})`);
        });
    }
    next();
};
