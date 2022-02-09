const router = require("express").Router();
const axios = require('axios').default;

router.get("/getToken:email", (request, response) => {
    const json = {
        "email": request.query.email
    }

})