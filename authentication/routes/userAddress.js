const router = require("express").Router();
const UserAddress = require("../models/userAddress");
const { checkToken } = require("../middlewares/security")
const Sequelize = require('sequelize');
const Op = Sequelize.Op
var logger = require('../settings/logger');

// GET ALL USER ADDRESSES
router.get("/userAddresses", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const addresses = request.query.userId ?
            await UserAddress.findAll({
                where: {
                    userId: request.query.userId,
                }
            }) :
            await UserAddress.findAll({
                where: {
                    userId: { [Op.in]: request.query.userIds },
                }
            });
        if (!addresses) {
            return response.status(404).json({
                "response": "No addresses found for current user(s)"
            });
        } else {
            return response.status(200).json({
                "response": addresses,
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// GET A USER ADDRESS FOR ORDERS
router.get("/userAddress", checkToken, async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const address = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.query.address1,
                    address2: request.query.address2

                }
            });
            if (!address) {
                return response.status(404).json({
                    "response": "Address not found"
                });
            } else {
                return response.status(200).json({
                    "response": address,
                    "userId": userId,
                    "userRole": userRole
                });
            }
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });

    }
});

//GET USER ADDRESS FOR ORDERS
router.get("/deliveryUserAddress", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const deliveryAddresses = await UserAddress.findAll({
            where: {
                id: { [Op.in]: request.query.addressIds }
            }
        });
        return response.status(200).json({
            "response": deliveryAddresses
        });
    }
    catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// CREATE ADDRESS
router.post("/userAddress", checkToken, async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const userAddressExistant = await UserAddress.findOne({
                where: {
                    address1: request.body.address1,
                    address2: request.body.address2,
                    address3: request.body.address3 !== undefined ? request.body.address3 : null,
                    userId: userId
                }
            })
            if (!userAddressExistant) {
                const newUserAddress = new UserAddress({
                    address1: request.body.address1,
                    address2: request.body.address2,
                    address3: request.body.address3 !== undefined ? request.body.address3 : null,
                    city: request.body.city,
                    region: request.body.region,
                    country: request.body.country,
                    postalCode: request.body.postalCode,
                    userId: userId
                });
                await newUserAddress.save();
                return response.status(201).json({
                    "response": "New address added"
                });
            } else {
                return response.status(409).json({
                    "response": "Address already existant for the current user"
                });
            }
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    }
    catch (error) {
        console.log(error)
        if (error.name === "SequelizeDatabaseError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(400).json({
                "response": "Bad json format"
            });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(409).json({
                "response": "Address already saved by current user"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MODIFY ADDRESS
router.put("/userAddress", checkToken, async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const userAddressToUpdate = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.body.address1,
                    address2: request.body.address2
                }
            });
            if (!userAddressToUpdate) {
                return response.status(404).json({
                    "response": "Address not found"
                });
            } else {
                userAddressToUpdate.update({
                    address1: request.body.newAddress1 !== undefined ? request.body.newAddress1 : userAddressToUpdate.address1,
                    address2: request.body.address2 !== undefined ? request.body.address2 : userAddressToUpdate.address2,
                    address3: request.body.address3 !== undefined ? request.body.address3 : userAddressToUpdate.address3,
                    city: request.body.city !== undefined ? request.body.city : userAddressToUpdate.city,
                    region: request.body.region !== undefined ? request.body.region : userAddressToUpdate.region,
                    country: request.body.country !== undefined ? request.body.country : userAddressToUpdate.country,
                    postalCode: request.body.postalCode !== undefined ? request.body.postalCode : userAddressToUpdate.postalCode
                });
                await userAddressToUpdate.save();
                return response.status(200).json({
                    "response": userAddressToUpdate
                });
            }
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


//DELETE ADDRESS
router.delete("/userAddress", checkToken, async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const userAddressToDelete = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.body.address1,
                    address2: request.body.address2
                }
            });
            if (!userAddressToDelete) {
                return response.status(404).json({
                    "response": "Address not found"
                });
            } else {
                await userAddressToDelete.destroy()
                return response.status(200).json({
                    "response": "Address deleted"
                });
            }
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});



module.exports = router;