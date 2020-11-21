const jwt = require("./middlewares/jwt");

console.log(jwt.generateToken("hi"));
