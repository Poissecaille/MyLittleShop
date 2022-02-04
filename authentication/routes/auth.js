const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken');

//REGISTER
router.post("/register", async (request, response) => {
    if (!request.body.email || !request.body.firstName || !request.body.lastName || !request.body.password || !request.body.birthDate) {
        return response.status(400).json({
            "response": "Bad json format!"
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
        modifiedAt: date
    });
    try {
        await newUser.save();
        return response.status(201).json({
            "response": "Signed in!"
        });
    } catch (error) {
        console.log("ERRORNAME", error.name)
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Email already used"
            })
        }
        return response.status(500).json(error);
    }
});

//LOGIN
router.post("/login", async (request, response) => {
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

        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

        // const key = "password"
        // var noPasswordUser = user
        // delete noPasswordUser[key]

        const accessToken = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });

        if (user === null) {
            return response.status(404).json({
                "response": "User not found"
            });
        }
        else if (originalPassword === request.body.password) {
            return response.status(200).json({
                "response": "Logged in",
                "token": accessToken
            });
        } else {
            return response.status(401).json({ "response": "Bad credentials" })
        }
    } catch (error) {
        return response.status(500).json(error);
    }
});

module.exports = router;