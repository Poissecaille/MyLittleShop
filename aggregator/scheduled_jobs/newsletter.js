var cron = require('node-cron');
const axios = require('axios');

//INVENTORY MICROSERVICE
const NEWSLETTER_URL = `http://inventory:${process.env.APP_INVENTORY_PORT}/api/newsLetter`;
const MAILER_URL = `http://mailer:${process.env.APP_MAILER_PORT}/api/newsLetter/mail`;
const USERS_URL = `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/admin/users`;

// exports.newsLetter = () => {
//     const newsLetter = cron.schedule("* * * * *", async () => {
//         var limit = 10;
//         var offset = 0;
//         var allWishs = [];
//         var allUsersIds = [];
//         var allEmails = [];

//         while (true) {
//             const wishs = await axios.get(NEWSLETTER_URL, {
//                 params: {
//                     limit: limit,
//                     offset: offset
//                 }
//             })
//             limit += 10
//             offset += 10
//             console.log(wishs.data.response)
//             allWishs.push(wishs.data.response)
//             // const mails = await axios.post(MAILER_URL, {
//             //     mailRecipient:
//             // })
//             if (wishs.data.response.length === 0) {
//                 allWishs.flat()
//                 allUsersIds = allWishs.filter((wish) => wish.id);
//                 break
//             }
//         };
//         const userData = await axios.get(USERS_URL, {
//             params: {
//                 ids: allUsersIds
//             }
//         });
//         for (let i = 0; i < userData.data.response.length; i++) {
//             for (let j = 0; j < allWishs.length; j++) {
//                 if (allWishs[j].ownerId === userData.data.response[i].id) {
//                     allWishs[j].user = userData.data.response[i]
//                     if (allEmails.indexOf(userData.data.response[i]) === -1) {
//                         allEmails.push(userData.data.response[i].email)
//                     }
//                 }
//             }
//         }
//         for (let i = 0; i < allEmails.length; i++) {
//             var emailStack = allWishs.filter((wish) => wish.user.email === allEmails[i])
//             const mailing = await axios.post(MAILER_URL, {
//                 mailRecipient: emailStack[0].user.email,
//                 mailSubject: "Your items are currently available in the marketplace",
//                 mailContent: emailStack
//             });
//         }
//         newsLetter.start();
//     })
// };