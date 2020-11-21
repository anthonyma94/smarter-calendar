"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const crypto_1 = require("./crypto");
const generateToken = (data) => {
    let token = jsonwebtoken_1.default.sign({ data: crypto_1.encrypt(data) }, config_1.JWT_SECRET);
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, data) => {
        if (err) {
            console.error(err);
            err.status = 500;
            err.message = "JWT verification failed.";
            next(err);
        }
        req.token = crypto_1.decrypt(data.data);
        next();
    });
};
exports.verifyToken = verifyToken;
