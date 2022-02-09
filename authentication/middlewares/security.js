const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")

const checkToken = (request, response, next) => {
    const header = request.headers.authorization;
    if (header) {
        const token = header.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                response.status(403).json({ "response": "Invalid token" });
                next();
            }
        })
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
}

const checkPassword = (request, response, next) => {
    const decryptedPassword = CryptoJS.AES.decrypt(request.body.password, process.env.PASSWORD_SECRET);
    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword === request.body.password) {
        next();
    } else {
        return response.status(401).json({ "response": "Bad credentials" });
    }
}


const checkIsAdminOrOwner = (request, response, next) => {
    checkToken(request, response, () => {
        if (request.user.role === "admin" || request.user.role === "admin") {
            next();
        } else {
            return response.status(403).json({ "response": "Forbidden" });
        }
    })
}

module.exports = {checkPassword, checkIsAdminOrOwner, checkToken };