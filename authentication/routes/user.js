const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdmin } = require("../middlewares/security")

router.put("/disable", checkIsAdmin, async (request, response) => {
    console.log("prout")
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format!"
        });
    }
    const requestedUser = await User.findOne(
        {
            where: { email: request.body.email }
        }
    );
    if (requestedUser) {
        requestedUser.update(
            { activated: false }
        ).then(() => {
            return response.status(200).json({
                "response": "User deactivated"
            });
        }).catch((error) => console.log(error))
    }
});

module.exports = router;