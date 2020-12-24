"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
var config_1 = __importDefault(require("../config"));
var key = crypto_1.default.scryptSync(config_1.default.CIPHER, "salt", 32);
var algo = "aes-256-cbc";
var pattern = ":";
var encrypt = function (data) {
    if (typeof data === "object")
        data = JSON.stringify(data);
    var iv = crypto_1.default.randomBytes(16);
    var cipher = crypto_1.default.createCipheriv(algo, key, iv);
    var encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString("base64") + pattern + encrypted.toString("base64");
};
exports.encrypt = encrypt;
var decrypt = function (data) {
    var parts = data.split(pattern);
    var iv = Buffer.from(parts.shift(), "base64");
    var cipher = crypto_1.default.createDecipheriv(algo, key, iv);
    var decrypted = Buffer.concat([
        cipher.update(Buffer.from(parts.shift(), "base64")),
        cipher.final(),
    ]);
    try {
        return JSON.parse(decrypted.toString());
    }
    catch (_a) {
        return decrypted.toString();
    }
};
exports.decrypt = decrypt;
