const router = require("express").Router();
const User = require("../models/user");
//const { checkIsAdminOrOwner, checkPassword } = require("./security")


// router.put("disable/:id", checkIsAdminOrOwner, async (request, response) => {

//     const requestedUser = await User.findByPk(request.params.id);
//     if (requestedUser.role === "seller"){
//         // CONTACT INVENTORY SERVICE
//     }
//     requestedUser.update(
//         {
//             activated: false
//         }
//     ).then(() => {
//         return response.status(200).json({
//             "response": "User deactivated"
//         });
//     }).catch((error) => console.log(error))
// });

router.put("user/disable/", checkIsAdminOrOwner, async (request, response) => {
    if (!request.body.email) {
        return response.status(400).json({
            "response": "No email provided!"
        });
    }
    const requestedUser = await User.findOne(request.params.email);
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