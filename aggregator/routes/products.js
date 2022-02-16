const router = require("express").Router();
const axios = require('axios');

const roads = {
    // PRODUCT MICROSERVICE
    SEARCH_PRODUCTS_BUYER_URL: "http://localhost:5003/api/buyer/products",
    SEARCH_PRODUCTS_SELLER_URL: "http://localhost:5003/api/seller/products",
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken"
}

//GET PRODUCTS FOR BUYERS AND SELLERS
router.get("/products", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
            const products = await axios.get(roads.SEARCH_PRODUCTS_BUYER_URL, {
                params: userId
            });
            return response.status(products.status).json({
                "response": products.data.response
            });
        } else if (userRole == "seller") {
            const products = await axios.get(roads.SEARCH_PRODUCTS_SELLER_URL, {
                params: userId
            })
            return response.status(products.status).json({
                "response": products.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.post("/product", async (request, response) => {
    if (!request.body.name || request.body.label || request.body.condition || request.body.description || request.body.unitPrice || request.body.availableQuantity) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "seller") {
            const newProduct = await axios.post(roads.SEARCH_PRODUCTS_SELLER_URL,
                {
                    name: request.body.name,
                    label: request.body.label,
                    condition: request.body.condition,
                    description: request.body.description,
                    unitPrice: request.body.unitPrice,
                    availableQuantity: request.body.availableQuantity,
                    ownerId: userId
                }
            )
            return response.status(newProduct.status).json({
                "response": newProduct.data.response
            });
        }
    }
    catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//SEARCH_USERS_URL: "http://localhost:5002/api/sellers"
// router.get("/products", async (request, response) => {
//     if (!request.query.userEmail) {
//         return response.status(400).json({
//             "response": "Bad request format",
//         });
//     }
//     var sellersIds = []
//     const sellers = await axios.get(roads.SEARCH_USERS_URL, {
//         params: {
//             userEmail: request.query.userEmail
//         },
//         headers: {
//             'Authorization': request.headers.authorization
//         }
//     })
//     sellers.data.response.forEach((seller) => {
//         sellersIds.push(seller.id)
//     });
//     console.log("######")
//     console.log(sellersIds)
//     const products = await axios.get(roads.SEARCH_PRODUCTS_URL, {
//         params: {
//             sellersIds
//         }
//     });
//     return response.status(200).json({
//         "response": products.data.response,
//         "numberOfProducts": products.data.rows
//     });
// });

module.exports = router;