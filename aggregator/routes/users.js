const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CREATE_ACCOUNT_URL: "http://localhost:5002/api/register",
    DISABLE_ACCOUNT_URL: "http://localhost:5002/api/disable"
}

router.post("/register", async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format!"
        });
    }
    try {
        const userToRegister = await axios.post(roads.CREATE_ACCOUNT_URL, {
            email: request.body.email,
            password: request.body.password,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            birthDate: request.body.birthDate
        });

        if (userToRegister.status === 201) {
            return response.status(201).json({
                "response": "Signed in!"
            });
        }
    } catch (error) {
        if (error.response.status === 409) {
            return response.status(409).json({
                "response": "Email already used"
            });
        } else if (error.response.status === 400) {
            return response.status(400).json({
                "response": "Bad json format!"
            });
        }
    }
});

router.put("/disable", async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format!"
        });
    }
    const userEmail = request.body.email;
    const userPassword = request.body.password;
    try {
        const userDisabled = await axios.put(roads.DISABLE_ACCOUNT_URL, {
            email: userEmail,
            password: userPassword,
        }, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        console.log("RESPONSE", userDisabled)
        return response.status(200).json({
            "response": "User deactivated"
        });
    } catch (error) {
        console.log(error)
        return response.status(400).json({
            "response": "The request failed"
        });
    }
});

module.exports = router;