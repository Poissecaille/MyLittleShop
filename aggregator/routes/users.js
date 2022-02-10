const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    DISABLE_ACCOUNT_URL: "http://localhost:5002/api/disable"
}

router.put("/disable", async (request, response) => {
    const userEmail = request.body.email;
    const userPassword = request.body.password;

    console.log("####", request.headers.authorization)
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

})

module.exports = router;