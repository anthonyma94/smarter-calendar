"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "../.env" });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const google_1 = __importDefault(require("./google"));
const jwt_1 = __importDefault(require("./middlewares/jwt"));
const config_1 = require("../../config");
const app = express_1.default();
// Middlewares
app.use(cookie_parser_1.default());
app.use(csurf_1.default({ cookie: true }));
// Routes
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/auth", require("./routes/auth"));
app.get("/api", jwt_1.default.verifyToken, async (req, res) => {
    const token = req.token;
    const user = await google_1.default.getUserInfo(token);
    // Refreshes cookie on initial visit
    res.cookie("jwt", jwt_1.default.generateToken(token), {
        httpOnly: true,
        secure: process.env.NODE_ENV &&
            process.env.NODE_ENV.toLowerCase() === "production",
        expires: new Date(Date.now() + 2592000000),
    });
    res.json(user);
});
app.get("/api/logout", jwt_1.default.verifyToken, async (req, res) => {
    res.clearCookie("jwt");
    res.json("Cookie cleared.");
});
// Error handling
app.use(function (err, req, res, next) {
    const status = err.statusCode || 500;
    const errMessages = {
        400: "Bad request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not found",
        500: "Internal Server Error",
    };
    res.status(status).send(err.message || errMessages[status] || "Unknown error occured.");
});
app.listen(config_1.PORT, () => console.log(`Server started on port ${config_1.PORT}`));
