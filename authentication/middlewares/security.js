const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")
const User = require("../models/user");

const checkToken = (request, response, next) => {
    var header;
    try {
        if (request.headers.authorization) {
            header = request.headers.authorization
        } else if (request.body.headers.Authorization) {
            header = request.body.headers.Authorization
        }
        if (header) {
            const token = header.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
                if (error) {
                    if (error instanceof jwt.TokenExpiredError) {
                        return response.status(403).json({ "response": "Token has expired" });
                    } else {
                        return response.status(403).json({ "response": "Invalid token" });
                    }
                }
                else {
                    request.user = user;
                    next();
                }
            })
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
        //return response.status(401).json({ "response": "Unauthorized" });
    }
}

const checkPasswordWithId = async (request, response, next) => {
    try {
        const saltUser = await User.findByPk(request.user.id);
        if (!saltUser) {
            return response.status(404).json({ "response": "No user found" });
        }
        const decryptedPassword = CryptoJS.AES.decrypt(saltUser.password, process.env.PASSWORD_SECRET);
        const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
        if (originalPassword === request.body.password) {
            next();
        } else {
            return response.status(401).json({ "response": "Bad credentials" });
        }
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
}
const checkAdminPasswordWithId = async (request, response, next) => {
    try {
        const saltUser = await User.findByPk(request.user.id);
        if (!saltUser) {
            return response.status(404).json({ "response": "No user found" });
        }
        if (saltUser.role === "admin") {
            const decryptedPassword = CryptoJS.AES.decrypt(saltUser.password, process.env.PASSWORD_SECRET);
            const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
            if (originalPassword === request.body.password) {
                next();
            } else {
                return response.status(401).json({ "response": "Bad credentials" });
            }
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
}


const checkPasswordWithEmail = async (request, response, next) => {
    const saltUser = await User.findOne({
        where: { email: request.body.email }
    })
    if (!saltUser) {
        return response.status(404).json({ "response": "No user found" });
    }
    const decryptedPassword = CryptoJS.AES.decrypt(saltUser.password, process.env.PASSWORD_SECRET);
    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword === request.body.password) {
        next();
    } else {
        return response.status(403).json({ "response": "Bad credentials" });
    }
}


// const checkIsAdminWithCorrectPassword = async (request, response, next) => {
//     console.log("blublublu", request.headers.authorization)
// checkToken(request, response, () => {});
//     if (request.user.role === "admin") {
//         checkPasswordWithId(request, response, () => {});
//     } else {
//         return response.status(403).json({ "response": "Forbidden" });
//     }

//}

module.exports = { checkToken, checkPasswordWithEmail, checkPasswordWithId , checkAdminPasswordWithId};