const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdminOrOwner, checkPassword } = require("./security")


router.put("disable/:id", checkIsAdminOrOwner, async (request, response) => {

    const requestedUser = await User.findByPk(request.params.id);
    if (requestedUser.role === "seller"){
        // CONTACT INVENTORY SERVICE
    }
    requestedUser.update(
        {
            activated: false
        }
    ).then(() => {
        return response.status(200).json({
            "response": "User deactivated"
        });
    }).catch((error) => console.log(error))
});

module.exports = router;