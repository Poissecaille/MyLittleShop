const router = require("express").Router();
const axios = require('axios');
const Fuse = require('fuse.js')

const roads = {
    // INVENTORY MICROSERVICE
    SEARCH_PRODUCTS_BUYER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/products`,
    SEARCH_PRODUCTS_SELLER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    PRODUCT_SELLER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/product`,
    // PRODUCT_CATEGORY_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productCategory`,
    // PRODUCT_TAG_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productTag`,
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`,
    // MAILER SERVICE
    MAILER_URL: `http://mailer:${process.env.APP_MAILER_PORT}/api/mailer`
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
            if (request.query.condition) {
                if (request.query.condition != "new" && request.query.condition != "occasion" && request.query.condition != "renovated" && request.query.condition != "all") {
                    return response.status(400).json({
                        "response": "Bad json format"
                    });
                }
                if (request.query.condition === "all") {
                    request.query.condition = null
                }
            }
            if (request.query.category) {
                if (request.query.category === "all") {
                    request.query.category = null
                }
            }
            if (request.query.tag) {
                if (request.query.tag === "all") {
                    request.query.tag = null
                }
            }

            var filter;
            var sellerData;
            // var category;
            // var tag;
            var sellerIds = [];
            var sellerNames = [];

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

            if (request.query.sellerUsername) {
                if (Array.isArray(sellerData.data.response)) {
                    for (let i = 0; i < sellerData.data.response.length; i++) {
                        sellerIds.push(sellerData.data.response[i].id)
                        sellerNames.push(sellerData.data.response[i].username)
                    }
                } else {
                    sellerIds.push(sellerData.data.response.id)
                    sellerNames.push(sellerData.data.response.username)
                }
                console.log("IDS:", sellerIds)
                console.log("NAMES:", sellerNames)
            }

            // if (request.query.category) {
            //     category = await axios.get(roads.PRODUCT_CATEGORY_URL,
            //         {
            //             params: {
            //                 name: request.query.category
            //             }
            //         }
            //     )

            // }

            // if (request.query.tag) {
            //     tag = await axios.get(roads.PRODUCT_TAG_URL,
            //         {
            //             params: {
            //                 name: request.query.tag
            //             }
            //         }
            //     )

            // }
            console.log(request.query.category, request.query.tag)
            const products = await axios.get(roads.SEARCH_PRODUCTS_BUYER_URL, {
                params: {
                    sellerId: sellerIds ? sellerIds : null,
                    // category: request.query.category ? category : null,
                    // tag: request.query.tag ? tag : null,
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
            if (request.query.productName !== "") {
                const options = {
                    isCaseSensitive: false,
                    shouldSort: true,
                    keys: [
                        "name"
                    ], threshold: 0.2
                };
                const fuse = new Fuse(products.data.response, options);
                const result = fuse.search(request.query.productName);
                var final = [];
                for (let i = 0; i < result.length; i++) {
                    console.log(final)
                    final.push(result[i].item)
                }
                return response.status(products.status).json({
                    "response": final,
                    "rows": result.length
                });
            } else {
                return response.status(products.status).json({
                    "response": products.data.response,
                    "rows": products.data.rows
                });
            }
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