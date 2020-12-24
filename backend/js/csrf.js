const csurf = require("csurf");

const csrf = csurf({ cookies: true });

module.exports = csrf;
