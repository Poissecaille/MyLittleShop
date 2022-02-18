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

// DISABLE ACCOUNT
router.put("/disable", checkIsAdminWithCorrectPassword, async (request, response) => {
    console.log(request.data)
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
    const userId = request.user.id
    const userRole = request.user.role
    const userToDeactivate = await User.findByPk(userId)
    // if (!userToDeactivate.activated) {
    //     return response.status(403).json({
    //         "response": "Account closed"
    //     });
    // }
    // userToDeactivate.update({
    //     activated: false
    // });
    return response.status(200).json({
        "response": "Account deleted",
        "userId": userId,
        "userRole": userRole
    });
});

module.exports = router;