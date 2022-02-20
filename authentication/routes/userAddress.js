const router = require("express").Router();
const UserAddress = require("../models/userAddress");
const { checkToken } = require("../middlewares/security")

const Sequelize = require('sequelize');
const Op = Sequelize.Op


// GET ALL USER ADDRESSES
router.get("/userAddresses", async (request, response) => {
    if (userRole == "buyer") {
        try {
            const addresses = await UserAddress.findAll({
                where: {
                    userId: request.query.userId,
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
        } catch (error) {
            return response.status(error.response.status).json({
                "response": error.response.data.response
            });
        }
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
});

// GET A USER ADDRESS
router.get("/userAddress", async (request, response) => {
    try {
        const address = await UserAddress.findOne({
            where: {
                userId: request.query.userId,
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
            });
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
    const userId = request.user.id
    const userRole = request.user.role
    if (userRole == "buyer") {
        try {
            const userAddressExistant = await UserAddress.findOne({
                where: {
                    address1: request.body.address1,
                    address2: request.body.address2,
                    address3: request.body.address3,
                    userId: userId
                }
            })
            if (!userAddressExistant) {
                const newUserAddress = new UserAddress({
                    address1: request.body.address1,
                    address2: request.body.address2,
                    address3: request.body.address3,
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
        } catch (error) {
            return response.status(error.response.status).json({
                "response": error.response.data.response
            });
        }
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
});

// MODIFY ADDRESS
router.put("/userAddress", checkToken, async (request, response) => {
    const userId = request.user.id
    const userRole = request.user.role
    if (userRole == "buyer") {
        try {
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
                userAddressToUpdate.update(request.body);
                await userAddressToUpdate.save();
                return response.status(200).json({
                    "response": userAddressToUpdate
                });
            }
        } catch (error) {
            return response.status(error.response.status).json({
                "response": error.response.data.response
            });
        }
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
});

//DELETE ADDRESS
router.delete("/userAddress", checkToken, async (request, response) => {
    const userId = request.user.id
    const userRole = request.user.role
    if (userRole == "buyer") {
        try {
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
        } catch (error) {
            return response.status(error.response.status).json({
                "response": error.response.data.response
            });
        }
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
});


module.exports = router;