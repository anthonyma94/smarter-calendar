import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import { encrypt, decrypt } from "./crypto";

export const generateToken = (data: any) => {
    let token = jwt.sign({ data: encrypt(data) }, config.JWT_SECRET);
    return token;
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies && req.cookies.jwt;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, config.JWT_SECRET, (err: any, data: any) => {
        if (err) {
            console.error(err);
            err.status = 500;
            err.message = "JWT verification failed.";
            next(err);
        }
        req.token = decrypt(data.data);
        next();
    });
};
