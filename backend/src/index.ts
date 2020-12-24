require("dotenv").config({ path: "../.env" });

import express from "express";
import cookieParser from "cookie-parser";

import * as jwt from "./middlewares/jwt";
import * as google from "./google";
import config from "./config";

import authRouter from "./routes/auth";
import calendarRouter from "./routes/calendar";

const app = express();

// Middlewares
app.use(cookieParser());

// app.use(csurf({ cookie: true, value: (req) => req.headers["x-xsrf-token"] }));

// Routes
app.use("/api/calendar", calendarRouter);
app.use("/api/auth", authRouter);

app.get("/api", jwt.verifyToken, async (req, res) => {
    const token = req.token;

    if (!token) {
        // error
    }

    const user = await google.getUserInfo(token as string);

    // Refreshes cookie on initial visit
    res.cookie("jwt", jwt.generateToken(token), {
        httpOnly: true,
        secure:
            !!process.env.NODE_ENV &&
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
// app.use(function (err, req: Request, res: Response, next: NextFunction) {
//     const status = err.statusCode || 500;
//     const errMessages = {
//         400: "Bad request",
//         401: "Unauthorized",
//         403: "Forbidden",
//         404: "Not found",
//         500: "Internal Server Error",
//     };

//     console.log(err);
//     res.status(status).send(
//         err
//         // err.message || errMessages[status] || "Unknown error occured."
//     );
// });

app.listen(config.PORT, () =>
    console.log(`Server started on port ${config.PORT}`)
);
