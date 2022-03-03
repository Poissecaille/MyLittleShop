const router = require("express").Router();
const User = require("../models/user");
const { checkIsAdminWithCorrectPassword, checkToken, checkPasswordWithId } = require("../middlewares/security")
const Sequelize = require('sequelize');
const Op = Sequelize.Op


//GET USER DATA FOR AGGREGATOR
router.get("/userData", async (request, response) => {
    try {
        var userData;
        if (Array.isArray(request.query.sellerUsername)) {
            userData = []
            request.query.sellerUsername.forEach(async (username) => {
                console.log("***************************")
                console.log(username.data)
                var user = await User.findOne({
                    where: {
                        username: username.data.response
                    }
                });
                userData.push(user)
            });
            // userData = await User.findAll({
            //     where: {
            //         [Op.like]: {
            //             [Op.any]: request.query.sellerUsername
            //         }
            //     }
            // });
            console.log("777777", "777777")
            console.log(userData)
        }
        else {
            console.log("***************************")
            console.log(request.query.sellerUsername)
            userData = await User.findOne({
                where: {
                    username: request.query.sellerUsername
                }
            })
        }
        if (!userData || userData.length == 0) {
            return response.status(404).json({
                "response": "No user found"
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
router.put("/disable", [checkToken, checkPasswordWithId], async (request, response) => {
    try {
        const userToDisable = await User.findOne(
            {
                where: { email: request.query.email }
            }
        );
        if (!userToDisable) {
            return response.status(404).json({
                "response": "User not found"
            });
        }
        userToDisable.update(
            { activated: false }
        )
        return response.status(200).json({
            "response": "User deactivated"
        });
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

// DEACTIVATE ACCOUNT
router.put("/deactivate", [checkToken, checkPasswordWithId], async (request, response) => {
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
        if (!userToDeactivate) {
            return response.status(404).json({
                "response": "User not found"
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
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;