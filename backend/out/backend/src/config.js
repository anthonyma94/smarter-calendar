"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    JWT_SECRET: process.env.JWT_SECRET || "super-secret",
    PORT: process.env.PORT || 5000,
    URL: process.env.URL || "http://localhost:3000",
    CIPHER: process.env.CIPHER || "password" || "6wTh2hBKvud3PT3PM.RTBb-UzCx99HfV",
};
