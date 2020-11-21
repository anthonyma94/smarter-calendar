"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const jwt = require("jsonwebtoken");
const google = __importStar(require("../google"));
const jwt = __importStar(require("../middlewares/jwt"));
const config_1 = require("../../../config");
const auth = express_1.default.Router();
// auth.use(cookieParser());
auth.get("/", (req, res) => res.json(google.getAuthURL()));
auth.get("/callback", async (req, res) => {
    const code = req.query.code;
    // try {
    const token = await google.getToken(code);
    res.cookie("jwt", jwt.generateToken(token), {
        httpOnly: true,
        secure: process.env.NODE_ENV &&
            process.env.NODE_ENV.toLowerCase() === "production",
        expires: new Date(Date.now() + 2592000000),
    });
    return res.redirect(req.cookies.url || config_1.URL);
    // } catch (err) {
    //     console.log(err);
    //     // next(err);
    // }
});
exports.default = auth;