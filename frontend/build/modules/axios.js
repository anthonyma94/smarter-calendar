"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "/api";
const http = axios_1.default.create({
    withCredentials: true,
    baseURL: BASE_URL,
    xsrfCookieName: "_csrf",
});
exports.default = http;
