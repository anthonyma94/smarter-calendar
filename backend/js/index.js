require("dotenv").config({ path: "../.env" });
const express = require("express");
const cookieParser = require("cookie-parser");

const google = require("./google");
const jwt = require("./middlewares/jwt");
const { PORT } = require("../config");
const { ModuleResolutionKind } = require("typescript");

const app = express();

// Middlewares
app.use(cookieParser());
const csrf = require("./csrf");

// app.use(csurf({ cookie: true, value: (req) => req.headers["x-xsrf-token"] }));

// Routes
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/auth", require("./routes/auth"));

app.get("/api", jwt.verifyToken, async (req, res) => {
    const token = req.token;
    const user = await google.getUserInfo(token);

    // Refreshes cookie on initial visit
    res.cookie("jwt", jwt.generateToken(token), {
        httpOnly: true,
        secure:
            process.env.NODE_ENV &&
            process.env.NODE_ENV.toLowerCase() === "production",
        expires: new Date(Date.now() + 2592000000), // 30 days
    });
    // res.cookie("_csrf", req.csrfToken());

    res.json(user);
});

app.get("/api/logout", jwt.verifyToken, async (req, res) => {
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

    console.log(err);
    res.status(status).send(
        err
        // err.message || errMessages[status] || "Unknown error occured."
    );
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
