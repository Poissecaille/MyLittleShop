const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken');
const { checkToken, checkPasswordWithEmail } = require("../middlewares/security");
var logger = require('../settings/logger');

// GIVE ACCESS TO BUYER REQUESTS
router.get("/checkToken", checkToken, async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        return response.status(200).json({
            "response": request.user
        });
    } catch (error) {
        logger.error(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})


// REGISTER
router.post("/register", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        var date = new Date();
        date = date.toISOString().split("T");
        date = date[0] + " " + date[1].split(".")[0];
        const newUser = new User({
            email: request.body.email,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            username: request.body.username,
            password: CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: request.body.birthdate,
            role: request.body.role,
            created_at: date,
            updated_at: date
        });
        await newUser.save();
        return response.status(201).json({
            "response": "Signed in"
        });
    } catch (error) {
        if (error.name === "SequelizeDatabaseError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(400).json({
                "response": "Bad json format"
            });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(409).json({
                "response": "Username or email already used"
            });
        }
    }
});

// LOGIN
router.post("/login", checkPasswordWithEmail, async (request, response) => {
    logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format"
        });
    }
    try {
        var tokenExpiration;
        const user = await User.findOne({
            where: {
                email: request.body.email,
            }
        });
        if (!user.activated) {
            return response.status(401).json({ "response": "Unauthorized" });
        }
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });
        jwt.verify(accessToken, process.env.JWT_SECRET, (error, user) => {
            tokenExpiration = user.exp
        })
        return response.status(200).json({
            "response": "Logged in",
            "token": accessToken,
        });
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;