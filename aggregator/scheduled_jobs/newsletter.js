var cron = require('node-cron');
const axios = require('axios');

//INVENTORY MICROSERVICE
const NEWSLETTER_URL = `http://inventory:${process.env.APP_INVENTORY_PORT}/api/newsLetter`;
const MAILER_NEWSLETTER_URL = `http://mailer:${process.env.APP_MAILER_PORT}/api/newsLetter/mail`;
const USERS_URL = `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/admin/users`;
const PRODUCT_PER_WISH_URL = `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productsPerCart`;

exports.newsLetter = () => {
    const newsLetter = cron.schedule("0 2 * * *", async () => {
        try {
            var limit = 10;
            var offset = 0;
            var allWishs = [];
            var allEmails = [];

            while (true) {
                const wishs = await axios.get(NEWSLETTER_URL, {
                    params: {
                        limit: limit,
                        offset: offset
                    }
                })
                limit += 10
                offset += 10
                //console.log(wishs.data.response)
                allWishs.push(wishs.data.response)
                // const mails = await axios.post(MAILER_URL, {
                //     mailRecipient:
                // })
                if (wishs.data.response.length === 0) {
                    allWishs = allWishs.flat()
                    console.log(allWishs)
                    var allUsersIds = allWishs.map((wish) => wish.ownerId);
                    var allWishProductsIds = allWishs.map((wish) => wish.productId);
                    break
                }
            };
            // console.log("sortie de boucle")
            // console.log(allUsersIds)
            // console.log(allWishProductsIds)
            // console.log("sortie de boucle")
            const userData = await axios.get(USERS_URL, {
                params: {
                    ids: allUsersIds
                }
            });
            const productData = await axios.get(PRODUCT_PER_WISH_URL, {
                params: {
                    productIds: allWishProductsIds
                }
            })
            // console.log("requetes")
            // console.log(userData.data.response)
            // console.log(productData.data.response)

            for (let j = 0; j < allWishs.length; j++) {
                for (let i = 0; i < userData.data.response.length; i++) {
                    if (allWishs[j].ownerId === userData.data.response[i].id) {
                        allWishs[j].user = userData.data.response[i]
                        if (allEmails.indexOf(userData.data.response[i]) === -1) {
                            allEmails.push(userData.data.response[i].email)
                        }
                    }
                }
                for (let k = 0; k < productData.data.response.length; k++) {
                    console.log(allWishs[j].productId, productData.data.response[k].id)
                    if (allWishs[j].productId === productData.data.response[k].id) {
                        allWishs[j].product = productData.data.response[k]
                    }
                }
            }

            console.log("WHISHS")
            console.log(allWishs)
            console.log("EMAILS")
            console.log(allEmails)

            for (let i = 0; i < allEmails.length; i++) {
                var emailStack = allWishs.filter((wish) => wish.user.email === allEmails[i])
                //var emailStack = allWishs.map((wish) => wish.user.email === allEmails[i])
                const mailing = await axios.post(MAILER_NEWSLETTER_URL, {
                    mailRecipient: emailStack[0].user.email,
                    usernameRecipient: emailStack[0].user.username,
                    mailSubject: "Your items are currently available in the marketplace",
                    mailContent: JSON.stringify(emailStack)
                });
                console.log(mailing)

            }
            newsLetter.start();
        } catch (error) { console.log(error) }
    })
};