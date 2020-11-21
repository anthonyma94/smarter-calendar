import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../../../config";
import { encrypt, decrypt } from "./crypto";

export const generateToken = (data) => {
    let token = jwt.sign({ data: encrypt(data) }, JWT_SECRET);
    return token;
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, data) => {
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
