const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdmin, checkToken } = require("../middlewares/security")

// DISABLE ACCOUNT
router.put("/disable", checkIsAdmin, async (request, response) => {
    const userToDisable = await User.findOne(
        {
            where: { email: request.query.email }
        }
    );
    //if (userToDisable) {
    userToDisable.update(
        { activated: false }
    )
    //.then(() => {
    return response.status(200).json({
        "response": "User deactivated"
    });
})//.catch((error) => console.log(error))
//}
//});

router.put("/deactivate", checkToken, async (request, response) => {
    tokenUserID = request.user.id
    const userToDeactivate = await User.findByPk(tokenUserID)
    userToDeactivate.update({
        activated: false
    });
    return response.status(200).json({
        "response": "Account deleted"
    });
});

module.exports = router;