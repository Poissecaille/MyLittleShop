const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CREATE_ACCOUNT_URL: "http://localhost:5002/api/register",
    LOGIN_ACCOUNT_URL: "http://localhost:5002/api/login",
    DISABLE_ACCOUNT_URL: "http://localhost:5002/api/disable",
    DEACTIVATE_ACCOUNT_URL: "http://localhost:5002/api/deactivate"
}
// BUYER LOGIN
router.post("/login", async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format"
        });
    }
    try {
        const userToLogin = await axios.post(roads.LOGIN_ACCOUNT_URL, {
            email: request.body.email,
            password: request.body.password,
        });
        if (userToLogin.status === 200) {
            return response.status(200).json({
                "response": userToLogin.data.response,
                "token": userToLogin.data.token
            });
        }
    } catch (error) {
        if (error.response.status === 401) {
            return response.status(401).json({
                "response": error.response.statusText
            });
        }
    }
});
// BUYER ACCOUNT CREATION
router.post("/register", async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format"
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
                "response": userToRegister.data.response
            });
        }
    } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
            return response.status(409).json({
                "response": error.response.statusText
            });
        } else if (error.response.status === 400) {
            return response.status(400).json({
                "response": error.response.statusText
            });
        }
    }
});
// ADMIN ROAD FOR ACCOUNT DISABLING
router.put("/disable", async (request, response) => {
    if (!request.body.password || !request.query.email) {
        return response.status(400).json({
            "response": "Bad json format"
        });
    }
    const userEmailToDisable = request.query.email;
    const userPassword = request.body.password;
    try {
        const userDisabled = await axios.put(roads.DISABLE_ACCOUNT_URL + "?email=" + userEmailToDisable, {
            password: userPassword,
        }, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        return response.status(200).json({
            "response": userDisabled.data.response
        });
    } catch (error) {
        console.log(error)
        return response.status(400).json({
            "response": error.response.statusText
        });
    }
});

router.put("/deactivate", async (request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({
            "response": "Unauthorized"
        });
    }
    const deactivatedAccount = await axios.put(roads.DEACTIVATE_ACCOUNT_URL, null, {
        headers: {
            'Authorization': request.headers.authorization
        }
    });
    return response.status(200).json({
        "response": deactivatedAccount.data.response
    });

});


module.exports = router;