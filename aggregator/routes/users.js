const router = require("express").Router();
const axios = require('axios');

const roads = {
    DISABLE_ACCOUNT_URL: "http://localhost:5002/api/user/disable/"
}

router.put("/disable", async (request, response) => {
    const userEmail = request.body.email;
    const userDisabled = await axios.put(DISABLE_ACCOUNT_URL, {
        email: userEmail
    });
})