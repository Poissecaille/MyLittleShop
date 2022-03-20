const router = require("express").Router();
const axios = require('axios');

const roads = {
    // PRODUCT MICROSERVICE
    SEARCH_PRODUCTS_BUYER_URL: "http://localhost:5003/api/buyer/products",
    SEARCH_PRODUCTS_SELLER_URL: "http://localhost:5003/api/seller/products",
    PRODUCT_SELLER_URL: "http://localhost:5003/api/seller/product",
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    USER_DATA_URL: "http://localhost:5002/api/userData",
    // MAILER SERVICE
    MAILER_URL: "http://localhost:5004/api/mailer"
}

//EVALUATE A BOUGHT PRODUCT
// router.post("/product/evaluation",async(request,response)=>{
//     try{
//         if (!request.body.productName){
//             return response.status(400).json({
//                 "response": "Bad json format",
//             });    
//         }
//         const user = await axios.get(roads.CHECK_TOKEN_URL, {
//             headers: {
//                 'Authorization': request.headers.authorization
//             }
//         });
//         const userId = user.data.response.id
//         const userRole = user.data.response.role
//         if (userRole == "buyer") {
//             const productToEvaluate = await axios.get(roads.)
//     }
// })

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
            var filter;
            var sellerData;
            if (request.query.condition) {
                if (request.query.condition != "new" && request.query.condition != "occasion" && request.query.condition != "renovated") {
                    return response.status(400).json({
                        "response": "Bad json format"
                    });
                }
            }
            if (!request.query.filter) {
                filter = "unitPrice";
            } else if (request.query.filter != "unitPrice" && request.query.filter != "condition") {
                return response.status(400).json({
                    "response": "Bad json format"
                });
            } else {
                filter = request.query.filter;
            }
            sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.query.sellerUsername
                }
            });
            var sellerIds = [];
            var sellerNames = [];
            if (request.query.sellerUsername) {
                if (Array.isArray(sellerData.data.response)) {
                    for (let i = 0; i < sellerData.data.response.length; i++) {
                        sellerIds.push(sellerData.data.response[i].id)
                        sellerNames.push(sellerData.data.response[i].username)
                        console.log(sellerData.data.response[i])
                    }
                } else {
                    console.log(sellerData.data.response)
                    sellerIds.push(sellerData.data.response.id)
                    sellerNames.push(sellerData.data.response.username)
                }
                console.log("IDS:", sellerIds)
                console.log("NAMES:", sellerNames)
            }

            const products = await axios.get(roads.SEARCH_PRODUCTS_BUYER_URL, {
                params: {
                    sellerId: sellerIds ? sellerIds : null,
                    productName: request.query.productName ? request.query.productName : null,
                    category: request.query.category ? request.query.category : null,
                    tag: request.query.tag ? request.query.tag : null,
                    lowerPrice: request.query.lowerPrice ? request.query.lowerPrice : 0,
                    higherPrice: request.query.higherPrice ? request.query.higherPrice : Infinity,
                    condition: request.query.condition ? request.query.condition : null,
                    filter: filter
                }
            });
            if (sellerIds && sellerIds.length > 0) {
                for (let i = 0; i < products.data.response.length; i++) {
                    for (let j = 0; j < sellerIds.length; j++) {
                        if (products.data.response[i].sellerId === sellerIds[j]) {
                            products.data.response[i].sellerUsername = sellerNames[j]
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < products.data.response.length; i++) {
                    for (let j = 0; j < sellerData.data.response.length; j++) {
                        if (sellerData.data.response[j].id == products.data.response[i].sellerId) {
                            products.data.response[i].sellerUsername = sellerData.data.response[j].username
                        }
                    }
                }
            }
            return response.status(products.status).json({
                "response": products.data.response,
                "rows": products.data.rows
            });
        } else if (userRole == "seller") {
            const products = await axios.get(roads.SEARCH_PRODUCTS_SELLER_URL, {
                params: {
                    sellerId: userId
                }
            });
            return response.status(products.status).json({
                "response": products.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        if (error.code == "ERR_HTTP_INVALID_HEADER_VALUE") {
            return response.status(401).json({ "response": "Unauthorized" });
        }
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.post("/product", async (request, response) => {
    try {
        if (!request.body.name || !request.body.label || !request.body.condition || !request.body.description || !request.body.unitPrice || !request.body.availableQuantity) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        if (request.body.condition != "new" && request.body.condition != "occasion" && request.body.condition != "renovated") {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "seller") {
            const newProduct = await axios.post(roads.PRODUCT_SELLER_URL,
                {
                    name: request.body.name,
                    label: request.body.label,
                    condition: request.body.condition,
                    description: request.body.description,
                    unitPrice: request.body.unitPrice,
                    availableQuantity: request.body.availableQuantity,
                    sellerId: userId,
                }
            )

            return response.status(newProduct.status).json({
                "response": newProduct.data.response
            });
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    }
    catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.put("/product", async (request, response) => {
    try {
        // if (process.env.NODE_ENV === "development") {
        //     if (!request.body.mailRecipient || !request.body.mailSubject || !request.body.mailContent) {
        //         return response.status(400).json({
        //             "response": "Bad json format",
        //         });
        //     }
        // }
        if (!request.body.name) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id;
        const userRole = user.data.response.role;
        request.body.userId = userId;
        if (userRole == "seller") {
            const productToUpdate = await axios.put(roads.PRODUCT_SELLER_URL, request.body)
            // if (productToUpdate.status == 200) {
            //     await axios.post(roads.MAILER_URL, {
            //         mailRecipient: request.body.mailRecipient,
            //         mailSubject: request.body.mailSubject,
            //         mailContent: request.body.mailContent
            //     });
            // }
            return response.status(productToUpdate.status).json({
                "response": productToUpdate.data.response
            });
        }
        else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


router.delete("/product", async (request, response) => {
    try {
        if (!request.body.name) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id;
        const userRole = user.data.response.role;
        request.body.userId = userId;
        if (userRole == "seller") {
            const productToDelete = await axios.delete(roads.PRODUCT_SELLER_URL, {
                data: {
                    productName: request.body.name,
                    sellerId: userId
                }
            });
            return response.status(productToDelete.status).json({
                "response": productToDelete.data.response
            });

        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;