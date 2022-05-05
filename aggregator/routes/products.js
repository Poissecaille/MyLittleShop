const router = require("express").Router();
const axios = require('axios');
const Fuse = require('fuse.js')

const roads = {
    // INVENTORY MICROSERVICE
    SEARCH_PRODUCTS_BUYER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/products`,
    SEARCH_PRODUCTS_SELLER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    PRODUCT_SELLER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/product`,
    CATEGORIES_PER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productCategories`,
    TAGS_PER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productTags`,
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
        var productIds = [];
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
            const sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.query.sellerUsername
                }
            });
            //if (request.query.sellerUsername) {
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
            //}
            // console.log(request.query.category, request.query.tag)
            const products = await axios.get(roads.SEARCH_PRODUCTS_BUYER_URL, {
                params: {
                    sellerId: sellerIds ? sellerIds : null,
                    category: request.query.category ? request.query.category : null,
                    tag: request.query.tag ? request.query.tag : null,
                    lowerPrice: request.query.lowerPrice ? request.query.lowerPrice : 0,
                    higherPrice: request.query.higherPrice ? request.query.higherPrice : Infinity,
                    condition: request.query.condition ? request.query.condition : null,
                    filter: filter,
                    onSale: true
                }
            });
            console.log("PRODUCTS:",products.data.response)
            if (sellerIds && sellerIds.length > 0) {
                for (let i = 0; i < products.data.response.length; i++) {
                    productIds.push(products.data.response[i].id)
                    for (let j = 0; j < sellerIds.length; j++) {
                        if (products.data.response[i].sellerId === sellerIds[j]) {
                            products.data.response[i].sellerUsername = sellerNames[j]
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < products.data.response.length; i++) {
                    productIds.push(products.data.response[i].id)
                    for (let j = 0; j < sellerData.data.response.length; j++) {
                        if (sellerData.data.response[j].id == products.data.response[i].sellerId) {
                            products.data.response[i].sellerUsername = sellerData.data.response[j].username
                        }
                    }
                }
            }
            // console.log("ERRRRREUR")
            // console.log(products.data.response)
            // console.log(productIds)
            // console.log(sellerIds)
            if (products.data.response.length === 0) {
                return response.status(products.status).json({
                    "response": products.data.response,
                    "rows": products.data.response.length
                });
            }
            const categoriesPerProduct = await axios.get(roads.CATEGORIES_PER_PRODUCT_URL,
                {
                    params: {
                        productIds: productIds
                    }
                })
            const tagsPerProduct = await axios.get(roads.TAGS_PER_PRODUCT_URL,
                {
                    params: {
                        productIds: productIds
                    }
                })

            for (let i = 0; i < products.data.response.length; i++) {
                products.data.response[i].categories = []
                products.data.response[i].tags = []
                for (let j = 0; j < categoriesPerProduct.data.response.length; j++) {
                    if (products.data.response[i].id === categoriesPerProduct.data.response[j].productId) {
                        products.data.response[i].categories.push(categoriesPerProduct.data.response[j].name)
                    }
                }
                for (let k = 0; k < tagsPerProduct.data.response.length; k++) {
                    if (products.data.response[i].id === tagsPerProduct.data.response[k].productId) {
                        products.data.response[i].tags.push(tagsPerProduct.data.response[k].name)
                    }
                }
            }
            if (request.query.productName) {
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
            var categoriesPerProduct = [];
            var tagsPerProduct = [];

            const products = await axios.get(roads.SEARCH_PRODUCTS_SELLER_URL, {
                params: {
                    sellerId: userId,
                    category: request.query.category ? request.query.category : null,
                    tag: request.query.tag ? request.query.tag : null,
                    lowerPrice: request.query.lowerPrice ? request.query.lowerPrice : 0,
                    higherPrice: request.query.higherPrice ? request.query.higherPrice : Infinity,
                    condition: request.query.condition ? request.query.condition : null,
                    filter: filter
                }
            });

            for (let i = 0; i < products.data.response.length; i++) {
                productIds.push(products.data.response[i].id)
            }
            if (products.data.response.length > 0) {
                categoriesPerProduct = await axios.get(roads.CATEGORIES_PER_PRODUCT_URL,
                    {
                        params: {
                            productIds: productIds
                        }
                    })
                tagsPerProduct = await axios.get(roads.TAGS_PER_PRODUCT_URL,
                    {
                        params: {
                            productIds: productIds
                        }
                    })

            }
            const sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.query.sellerUsername
                }
            });

            for (let i = 0; i < products.data.response.length; i++) {
                products.data.response[i].categories = []
                products.data.response[i].tags = []
                products.data.response[i].sellerUsername = sellerData.data.response[0].username
                //products.data.response[i].sellerProduct = true
                for (let j = 0; j < categoriesPerProduct.data.response.length; j++) {
                    if (products.data.response[i].id === categoriesPerProduct.data.response[j].productId) {
                        products.data.response[i].categories.push(categoriesPerProduct.data.response[j].name)
                    }
                }
                for (let k = 0; k < tagsPerProduct.data.response.length; k++) {
                    if (products.data.response[i].id === tagsPerProduct.data.response[k].productId) {
                        products.data.response[i].tags.push(tagsPerProduct.data.response[k].name)
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
                final = [];
                for (let i = 0; i < result.length; i++) {
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

//ALLOW A SELLER TO CREATE A PRODUCT
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
            if (newProduct.status === 201) {
                if (request.body.categories) {
                    const categoriesToCreate = await axios.post(roads.CATEGORIES_PER_PRODUCT_URL, {
                        categoriesToCreate: request.body.categories,
                        productId: newProduct.data.response.id
                    })
                }
            }
            if (newProduct.status === 201) {
                if (request.body.tags) {
                    const tagsToCreate = await axios.post(roads.TAGS_PER_PRODUCT_URL, {
                        tagsToCreate: request.body.tags,
                        productId: newProduct.data.response.id
                    })
                }
            }
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

            if (request.body.categories) {
                let productCategoriesNames = [];
                const categories = await axios.get(roads.CATEGORIES_PER_PRODUCT_URL, {
                    params: {
                        productIds: [productToUpdate.data.response.id]
                    }
                })
                for (let i = 0; i < categories.data.response.length; i++) {
                    productCategoriesNames.push(categories.data.response[i].name)
                }
                var categoriesToDelete = productCategoriesNames.filter(element =>
                    !request.body.categories.includes(element)
                )
                var categoriesToCreate = request.body.categories.filter(element =>
                    !productCategoriesNames.includes(element)
                )

                console.log("request", request.body.categories)
                console.log("db", productCategoriesNames)
                console.log("à créer", categoriesToCreate)
                console.log("à détruire", categoriesToDelete)

                const newCategories = await axios.post(roads.CATEGORIES_PER_PRODUCT_URL, {
                    categoriesToCreate: categoriesToCreate,
                    productId: productToUpdate.data.response.id
                });
                const oldCategories = await axios.delete(roads.CATEGORIES_PER_PRODUCT_URL, {
                    categoriesToDelete: categoriesToDelete,
                    productId: productToUpdate.data.response.id
                });
            }
            if (request.body.tags) {
                let productTagsNames = [];
                const tags = await axios.get(roads.TAGS_PER_PRODUCT_URL, {
                    params: {
                        productIds: [productToUpdate.data.response.id]
                    }
                })
                var tagsToDelete = productTagsNames.filter(element =>
                    !request.body.tags.includes(element)
                )
                var tagsToCreate = request.body.tags.filter(element =>
                    !productTagsNames.includes(element)
                )
                console.log("request", request.body.tags)
                console.log("db", productTagsNames)
                console.log("à créer", tagsToCreate)
                console.log("à détruire", tagsToDelete)

                const newTags = await axios.post(roads.TAGS_PER_PRODUCT_URL, {
                    tagsToCreate: tagsToCreate,
                    productId: productToUpdate.data.response.id
                });
                const oldTags = await axios.delete(roads.TAGS_PER_PRODUCT_URL, {
                    tagsToDelete: tagsToDelete,
                    productId: productToUpdate.data.response.id
                });
            }
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