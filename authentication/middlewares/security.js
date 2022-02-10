const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")
const User = require("../models/user");

const checkToken = (request, response, next) => {
    const header = request.headers.authorization;
    if (header) {
        const token = header.split(" ")[2];
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                response.status(403).json({ "response": "Invalid token" });
            } else {
                console.log(user)
                request.user = user;
                next();
            }
        })
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
}

const checkPassword = (request, response, next) => {
    console.log("request VERIFICATION", request.password)
    const decryptedPassword = CryptoJS.AES.decrypt(request.password, process.env.PASSWORD_SECRET);
    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword === request.body.password) {
        next();
    } else {
        return response.status(401).json({ "response": "Bad credentials" });
    }
}


const checkIsAdmin = (request, response, next) => {
    checkToken(request, response, async () => {
        if (request.user.role === "admin") {
            next();
        } else if (request.user.id) {
            const requestedUser = await User.findOne(
                {
                    where: { id: request.user.id }
                }
            );
            if (!requestedUser) {
                return response.status(403).json({ "response": "Forbidden" });
            } else {
                const originalPassword = requestedUser.password;
                request.password = originalPassword
                checkPassword(request, response, () => {
                    next()
                });
            }
        } else {
            return response.status(403).json({ "response": "Forbidden" });
        }
    })
}

module.exports = { checkIsAdmin, checkToken };