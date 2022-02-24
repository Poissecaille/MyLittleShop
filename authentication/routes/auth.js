const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken');
const { checkPasswordWithEmail, checkToken } = require("../middlewares/security");

// GIVE ACCESS TO BUYER REQUESTS
router.get("/checkToken", checkToken, async (request, response) => {
    // if (response == 403) {
    //     return response.status(403).json({ "response": "Token has expired" });
    // } else {
    //     return response.status(200).json({
    //         "response": request.user
    //     });
    // }
    try {
        return response.status(200).json({
            "response": request.user
        });
    } catch (error) {
        console.log(error)
    }
})


// REGISTER
router.post("/register", async (request, response) => {
    try {
        var date = new Date();
        date = date.toISOString().split("T");
        date = date[0] + " " + date[1].split(".")[0];
        const newUser = new User({
            email: request.body.email,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            username: request.body.username,
            password: CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD_SECRET).toString(),
            birthDate: request.body.birthDate,
            role: request.body.role,
            createdAt: date,
            updatedAt: date
        });
        await newUser.save();
        return response.status(201).json({
            "response": "Signed in"
        });
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeDatabaseError") {
            return response.status(400).json({
                "response": "Bad json format"
            });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "User already existant"
            });
        }
    }
});

// LOGIN
router.post("/login", checkPasswordWithEmail, async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Malformed request"
        });
    }
    try {
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
            //activated: user.activated
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });

        return response.status(200).json({
            "response": "Logged in",
            "token": accessToken
        });
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;