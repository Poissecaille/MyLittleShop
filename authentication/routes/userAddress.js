const router = require("express").Router();
const UserAddress = require("../models/userAddress");
const { checkToken } = require("../middlewares/security")

const Sequelize = require('sequelize');
const Op = Sequelize.Op


// GET ALL USER ADDRESSESD
router.get("/userAddresses", checkToken, async (request, response) => {
    const addresses = await UserAddress.findAll();
    if (!addresses) {
        return response.status(404).json({
            "response": "Address not found"
        });
    } else {
        return response.status(200).json({
            "response": addresses
        });
    }
});

// GET A USER ADDRESS
router.get("/userAddress", checkToken, async (request, response) => {
    const userID = request.user.id;
    const address = await UserAddress.findOne({
        where: {
            userId: userID,
            address1: request.query.address1
        }
    });
    if (!address) {
        return response.status(404).json({
            "response": "Address not found"
        });
    } else {
        return response.status(200).json({
            "response": address
        });
    }
});

// CREATE ADDRESS
router.post("/userAddress", checkToken, async (request, response) => {
    const userID = request.user.id
    const userAddressExistant = await UserAddress.findOne({
        where: {
            address1: request.body.address1,
            address2: request.body.address2,
            address3: request.body.address3,
            userId: userID
        }
    })
    if (!userAddressExistant) {
        try {
            const newUserAddress = new UserAddress({
                address1: request.body.address1,
                address2: request.body.address2,
                address3: request.body.address3,
                city: request.body.city,
                region: request.body.region,
                country: request.body.country,
                postalCode: request.body.postalCode,
                userId: userID
            });
            await newUserAddress.save();
            return response.status(201).json({
                "response": "New address added"
            });
        } catch (error) {
            console.log(error)
        }
    } else {
        return response.status(409).json({
            "response": "Address already existant for the current user"
        });
    }
});

// MODIFY ADDRESS
router.put("/userAddress", checkToken, async (request, response) => {
    const userID = request.user.id;
    const userAddressToUpdate = await UserAddress.findOne({
        where: {
            userId: userID,
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
});

//DELETE ADDRESS
router.delete("/userAddress", checkToken, async (request, response) => {
    const userID = request.user.id;
    const userAddressToDelete = await UserAddress.findOne({
        where: {
            userId: userID,
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
});

module.exports = router;