const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdmin, checkToken } = require("../middlewares/security")
const Sequelize = require('sequelize');
const Op = Sequelize.Op

// GET ACCOUNTS
router.get("/sellers", checkToken, async (request, response) => {
    if (!request.query.userEmail) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    var userEmails = []
    if (Array.isArray(request.query.userEmail)) {
        await request.query.userEmail.forEach(
            (email) => {
                userEmails.push(email)
            }
        )
    } else {
        var dict = {}
        ["email"] = request.query.userEmail
        userEmails.push(dict)
    }
    try {
        const users = await User.findAll({
            where: {
                [Op.and]: [
                    { email: { [Op.or]: userEmails } },
                    { role: { [Op.eq]: "seller" } }
                ]
            }
        });
        return response.status(200).json({
            "response": users
        });
    } catch (error) { console.log(error) }
});

// DISABLE ACCOUNT
router.put("/disable", checkIsAdmin, async (request, response) => {
    const userToDisable = await User.findOne(
        {
            where: { email: request.query.email }
        }
    );

    userToDisable.update(
        { activated: false }
    )

    return response.status(200).json({
        "response": "User deactivated"
    });
})

// DEACTIVATE ACCOUNT
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