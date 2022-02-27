const router = require("express").Router();
const UserAddress = require("../models/userAddress");
const { checkToken } = require("../middlewares/security")

const Sequelize = require('sequelize');
const Op = Sequelize.Op

//TODO check if all get succeed when data response is empty
// GET ALL USER ADDRESSES
router.get("/userAddresses", checkToken, async (request, response) => {
    try {
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const addresses = await UserAddress.findAll({
                where: {
                    userId: userId,
                }
            });
            if (!addresses) {
                return response.status(404).json({
                    "response": "Address not found"
                });
            } else {
                return response.status(200).json({
                    "response": addresses,
                    "userRole": userRole
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

// GET A USER ADDRESS FOR ORDERS
router.get("/userAddress", checkToken, async (request, response) => {
    try {
        console.log("ERRORDETECTION",request.query.address1)
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const address = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.query.address1
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

// CREATE ADDRESS
router.post("/userAddress", checkToken, async (request, response) => {
    try {
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
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MODIFY ADDRESS
router.put("/userAddress", checkToken, async (request, response) => {
    try {
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const userAddressToUpdate = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.body.address1
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
        const userId = request.user.id
        const userRole = request.user.role
        if (userRole == "buyer") {
            const userAddressToDelete = await UserAddress.findOne({
                where: {
                    userId: userId,
                    address1: request.body.address1
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