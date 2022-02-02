const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js")

//REGISTER
router.post("/register", async (request, response) => {
    if (!request.body.email || !request.body.username || !request.body.password || !request.body.birthdate || !request.body.role) {
        response.setHeader('Content-Type', 'application/json').status(400).json({
            "response": "Bad json format!"
        });
    }
    const newUser = new User({
        email: request.body.email,
        username: request.body.username,
        password: CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD_SECRET).toString(),
        birthdate: request.body.birthdate,
        role: request.body.role,
    });
    try {
        await newUser.save();
        response.setHeader('Content-Type', 'application/json').status(201).json({
            "response": "User successfully registred!"
        });
    } catch (error) {
        response.status(500).json(error);

    }
});

//LOGIN
router.post("/login", async (request, response) => {
    const user = await User.findOne({
        username: request.body.username,
        password: request.body.password
    })
    const password = CryptoJS.AES.decrypt(request.body.password, process.env.PASSWORD_SECRET);
    const uncryptedPassword = password.toString(CryptoJS.enc.Utf8);
    console.log(password);
    console.log(uncryptedPassword);
    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
        response.setHeader('Content-Type', 'application/json').status(201).json({
            "response": "User successfully registred!"
        });
    } catch (error) {
        response.status(500).json(error);

    }
});

module.exports = router;