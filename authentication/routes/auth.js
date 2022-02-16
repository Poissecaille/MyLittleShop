const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken');
const { checkPasswordWithEmail } = require("../middlewares/security");

// REGISTER
router.post("/register", async (request, response) => {
    if (!request.body.email || !request.body.firstName || !request.body.lastName || !request.body.password || !request.body.birthDate) {
        return response.status(400).json({
            "response": "Bad json format"
        });
    }
    var date = new Date();
    date = date.toISOString().split("T");
    date = date[0] + " " + date[1].split(".")[0];
    const newUser = new User({
        email: request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        password: CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD_SECRET).toString(),
        birthDate: request.body.birthDate,
        createdAt: date,
        updatedAt: date
    });
    console.log("WAT", newUser.password)
    try {
        await newUser.save();
        return response.status(201).json({
            "response": "Signed in"
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Email already used"
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
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });

        return response.status(200).json({
            "response": "Logged in",
            "token": accessToken
        });
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
});

module.exports = router;