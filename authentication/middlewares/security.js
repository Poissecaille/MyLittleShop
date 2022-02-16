const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")
const User = require("../models/user");

const checkToken = (request, response, next) => {
    var header = undefined;
    console.log("HEADER", request.headers.authorization)
    //const header = request.headers.authorization ? request.headers.authorization !== "undefined" : request.body.headers.Authorization
    if (request.headers.authorization) {
        header = request.headers.authorization
    } else if (request.body.headers.Authorization) {
        header = request.body.headers.Authorization
    }
    if (header) {
        const token = header.split(" ")[1];
        console.log("TOKEN", token)
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                response.status(403).json({ "response": "Invalid token" });
            } else {
                request.user = user;
                next();
            }
        })

    } else {
        return response.status(401).json({ "response": "Unauthorized" });
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
        return response.status(401).json({ "response": "Bad credentials" });
    }
}

const checkPasswordWithId = async (request, response, next) => {
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
}

const checkIsAdmin = (request, response, next) => {
    checkToken(request, response, async () => {
        if (request.user.role === "admin") {
            next();
        } else {
            return response.status(403).json({ "response": "Forbidden" });
        }
    })
}
// const checkIsBuyerOrAdmin = (request, response, next) => {
//     checkToken(request, response, async () => {
//         if (request.user.role === "buyer" || request.user.role === "admin") {
//             next();
//         } else {
//             return response.status(403).json({ "response": "Forbidden" });
//         }
//     })
// }
// const checkIsSellerOrAdmin = (request, response, next) => {
//     checkToken(request, response, async () => {
//         if (request.user.role === "seller" || request.user.role === "admin") {
//             next();
//         } else {
//             return response.status(403).json({ "response": "Forbidden" });
//         }
//     })
// }

const checkIsAdminWithCorrectPassword = (request, response, next) => {
    checkToken(request, response, () => {
        if (request.user.role === "admin") {
            checkPasswordWithId(request, response, async () => {
                console.log("####")
                console.log(request)
            }
            )
        }
    })
}
// else if (request.user.id) {
//     const requestedUser = await User.findOne(
//         {
//             where: { id: request.user.id }
//         }
//     );
//     if (!requestedUser) {
//         return response.status(403).json({ "response": "Forbidden" });
//     } 
//else {
//  const originalPassword = requestedUser.password;
//  request.password = originalPassword
//TODO reimplement checkPassword directy on functions which need it
// checkPassword(request, response, () => {
//     console.log("WTFFFFFFFFFFF")
//     next()
// });
//}
// else {
//     next()
// }
// } else {
//     return response.status(403).json({ "response": "Forbidden" });
// }
// })
//}

module.exports = { checkIsAdmin, checkToken, checkIsAdminWithCorrectPassword, checkToken, checkPasswordWithEmail, checkPasswordWithId };