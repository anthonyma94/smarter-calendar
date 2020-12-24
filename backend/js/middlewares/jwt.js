const jwt = require("jsonwebtoken");

const { JWT_SECRET, CIPHER } = require("../../config");
const { encrypt, decrypt } = require("./crypto");

const generateToken = (data) => {
    let token = jwt.sign({ data: encrypt(data) }, JWT_SECRET);
    return token;
};

const verifyToken = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) {
            console.error(err);
            err.status = 500;
            err.message = "JWT verification failed.";
            next(err);
        }

        payload = decrypt(data.data);
        req.token = payload;
        next();
    });
};

module.exports = {
    verifyToken,
    generateToken,
};
