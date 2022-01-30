const router = require("express").Router();

router.post("/register", (request, response) => {
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;
    const birthdate = request.body.birthdate;
})

module.exports = router;