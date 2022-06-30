const jwt = require("jsonwebtoken");

// jwt token verify
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            // console.log(user);
            next();
        });
    } else {
        return res.status(401).json("Unauthorized request!");
    }
};

// all exports
module.exports = {
    verifyToken,
};
