const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdminWithCorrectPassword, checkToken } = require("../middlewares/security")
const Sequelize = require('sequelize');
const Op = Sequelize.Op


// // GET ACCOUNTS
// router.get("/sellers", checkToken, async (request, response) => {
//     if (!request.query.userEmail) {
//         return response.status(400).json({
//             "response": "Bad request format",
//         });
//     }
//     var userEmails = []
//     if (Array.isArray(request.query.userEmail)) {
//         await request.query.userEmail.forEach(
//             (email) => {
//                 userEmails.push(email)
//             }
//         )
//     } else {
//         var dict = {}
//         ["email"] = request.query.userEmail
//         userEmails.push(dict)
//     }
//     try {
//         const users = await User.findAll({
//             where: {
//                 [Op.and]: [
//                     { email: { [Op.or]: userEmails } },
//                     { role: { [Op.eq]: "seller" } }
//                 ]
//             }
//         });
//         return response.status(200).json({
//             "response": users
//         });
//     } catch (error) { console.log(error) }
// });

//GET USER DATA FOR AGGREGATOR
router.get("/userData", async (request, response) => {
    try {
        const userData = await User.findOne({
            where: {
                userName: request.query.sellerUsername
            }
        });
        if (!userData) {
            return response.status(404).json({
                "response": "No product found"
            });
        }
        return response.status(200).json({
            "response": userData
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// DISABLE ACCOUNT
router.put("/disable", checkIsAdminWithCorrectPassword, async (request, response) => {
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
    try {
        const userId = request.user.id
        const userRole = request.user.role
        const userActivated = await User.findByPk(userId)
        if (!userActivated.activated) {
            return response.status(403).json({
                "response": "Account closed"
            });
        }
        const userToDeactivate = await User.findByPk(userId)
       if (!userToDeactivate){
           return response.status(404).json({
               "response":"User not found"
           });
       }
        userToDeactivate.update({
            activated: false
        });
        await userToDeactivate.save();
        console.log("userToDeactivate", userToDeactivate)
        return response.status(200).json({
            "response": "Account deleted",
            "userId": userId,
            "userRole": userRole
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;