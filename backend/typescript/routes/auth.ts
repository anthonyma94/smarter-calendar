import cookieParser from "cookie-parser";
import express from "express";
import csurf from "csurf";
// const jwt = require("jsonwebtoken");

import * as google from "../google";
import * as jwt from "../middlewares/jwt";
import { URL } from "../../../config";

const auth = express.Router();

// auth.use(cookieParser());

auth.get("/", (req, res) => res.json(google.getAuthURL()));

auth.get("/callback", async (req, res) => {
    const code = req.query.code;
    // try {
    const token = await google.getToken(code);
    res.cookie("jwt", jwt.generateToken(token), {
        httpOnly: true,
        secure:
            process.env.NODE_ENV &&
            process.env.NODE_ENV.toLowerCase() === "production",
        expires: new Date(Date.now() + 2592000000), // 30 days
    });
    return res.redirect(req.cookies.url || URL);
    // } catch (err) {
    //     console.log(err);
    //     // next(err);
    // }
});

export default auth;
