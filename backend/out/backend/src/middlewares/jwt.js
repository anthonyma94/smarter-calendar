"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("../config"));
var crypto_1 = require("./crypto");
var generateToken = function (data) {
    var token = jsonwebtoken_1.default.sign({ data: crypto_1.encrypt(data) }, config_1.default.JWT_SECRET);
    return token;
};
exports.generateToken = generateToken;
var verifyToken = function (req, res, next) {
    var token = req.cookies && req.cookies.jwt;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET, function (err, data) {
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
