const express = require("express");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

app.post('/api/mail', async (request, response) => {
    try {
        if (!request.body.recipient || !request.body.mailSubject || !request.body.mailContent) {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                requireTLS: true,
                port: 587,
                auth: {
                    user: process.env.APP_MAILER_USER,
                    pass: process.env.APP_MAILER_PASSWORD
                }
            });
            var mailSettings = {
                from: process.env.APP_MAILER_USER,
                to: request.body.mailRecipient,
                subject: request.body.mailSubject,
                text: request.body.mailContent
            };
            transporter.sendMail(mailSettings, (error, info) => {
                if (error) {
                    console.log(error)
                    return response.status(424).json({
                        "response": "An error occured during mail sending"
                    })
                } else {
                    console.log(info)
                    console.log(`Email sent to ${request.body.mailRecipient} about ${request.body.mailSubject}`)
                    resolve()
                }
            });
        }).then(() => {
            return response.status(200).json({
                "response": "Mail sent"
            })
        }).catch((error) => {
            console.log(error)
        })

    } catch (error) {
        console.log("##################")
        console.log(error)
    }
});

//NETWORK SETTINGS
app.listen(process.env.APP_MAILER_PORT, () => {
    console.log(`Mailer is running on port ${process.env.APP_MAILER_PORT}`);
});