"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../../../config");
const key = crypto_1.default.scryptSync(config_1.CIPHER, "salt", 32); // has to be 32 for aes-256
const algo = "aes-256-cbc";
const pattern = ":";
const encrypt = (data) => {
    if (typeof data === "object")
        data = JSON.stringify(data);
    const iv = crypto_1.default.randomBytes(16); // has to be 16 for aes
    const cipher = crypto_1.default.createCipheriv(algo, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString("base64") + pattern + encrypted.toString("base64");
};
exports.encrypt = encrypt;
const decrypt = (data) => {
    let parts = data.split(pattern);
    const iv = Buffer.from(parts.shift(), "base64");
    const cipher = crypto_1.default.createDecipheriv(algo, key, iv);
    let decrypted = Buffer.concat([
        cipher.update(Buffer.from(parts.shift(), "base64")),
        cipher.final(),
    ]);
    try {
        return JSON.parse(decrypted.toString());
    }
    catch {
        return decrypted.toString();
    }
};
exports.decrypt = decrypt;
