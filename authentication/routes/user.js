const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdminOrOwner, checkPassword } = require("./security")


router.put("disable/:id", checkIsAdminOrOwner, (request, response) => {

    const requestUser = await User.findByPk(request.params.id);
    requestUser.update(
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