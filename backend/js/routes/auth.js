const cookieParser = require("cookie-parser");
const express = require("express");
const csurf = require("csurf");
// const jwt = require("jsonwebtoken");

const google = require("../google");
const jwt = require("../middlewares/jwt");
const { URL } = require("../../config");

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
    return res.redirect(req.headers.referer || req.cookies.url || URL);
    // } catch (err) {
    //     console.log(err);
    //     // next(err);
    // }
});

module.exports = auth;
