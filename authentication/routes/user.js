const router = require("express").Router();
const User = require("../models/user");
const { checkToken, checkPasswordWithId, checkAdminPasswordWithId } = require("../middlewares/security")
const Sequelize = require('sequelize');
const Op = Sequelize.Op


//GET USER DATA FOR AGGREGATOR
router.get("/userData", async (request, response) => {
    try {
        var userData;
        if (request.query.userId) {
            const user = await User.findByPk(request.query.userId);
            return response.status(200).json({
                "response": user
            });
        }
        if (!request.query.sellerUsername) {
            const users = await User.findAll({
                where: {
                    role: "seller"
                }
            })
            if (!users) {
                return response.status(404).json({
                    "response": "No user found"
                });
            }
            return response.status(200).json({
                "response": users
            });
        }
        else if (Array.isArray(request.query.sellerUsername)) {
            userData = []
            for (let i = 0; i < request.query.sellerUsername.length; i++) {
                const user = await User.findOne({
                    where: {
                        username: request.query.sellerUsername[i]
                    }
                });
                if (user) {
                    userData.push(user.dataValues)
                }
            }
        }
        else {
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
router.put("/disable", [checkToken, checkAdminPasswordWithId], async (request, response) => {
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
        console.log(request.user.role)
        console.log(request.user.id)

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

// SYNC USER ACCOUNT FOR AGGREGATOR
router.get("/syncAccount", checkToken, async (request, response) => {
    try {
        var result = {};
        const userId = request.user.id
        const userData = await User.findByPk(userId)
        result.email = userData.email
        result.username = userData.username
        result.firstname = userData.firstname
        result.lastname = userData.lastname
        result.birthdate = userData.birthdate
        return response.status(200).json({
            "response": result
        });
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

//SYNC CART WITH FRONT STORAGE FOR SELLERS
router.get("/syncSellersPerProduct", async (request, response) => {
    try {
        const sellerData = await User.findAll({
            where: {
                id: { [Op.in]: request.query.sellerIds }
            }
        });
        return response.status(200).json({
            "response": sellerData
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//ADMIN CONSOLE ROUTE
router.get("/admin", async (request, response) => {
    try {
        const users = await User.findAll({
            limit: request.query.limit,
            offset: request.query.offset
        });
        console.log(users)
        return response.status(200).json({
            "response": users
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;