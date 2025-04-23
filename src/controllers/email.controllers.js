import brevo from '@getbrevo/brevo'
import { updateClientEmailStatus } from '../utils/updateEmail.js'

export const sendEmail = async (req, res) => {
    try {
        let apiInstance = new brevo.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.BREVO_API;
    
        let sendSmtpEmail = new brevo.SendSmtpEmail();
    
        sendSmtpEmail.subject = req.body.subject;
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Correo Electrónico</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            color: #2D2D2D;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            box-sizing: border-box;
                            background-color: #ffffff;
                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        }
                        .parrafo {
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div>
                            <p class="parrafo">${req.body.email.replace(/\n/g, "<br>")}</p>
                        </div>
                        <hr>
                        <p>Para cualquier consulta, responde este email o contactate con prueba@prueba.cl</p>
                    </div>
                </body>
                </html>
        `
        sendSmtpEmail.sender = [{
            email: req.params.id
        }]
        sendSmtpEmail.to = [
            { "email": req.params.id }
        ];
        const uniqueId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        sendSmtpEmail.headers = { "X-Unique-Id": uniqueId };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };

        await updateClientEmailStatus(req.params.id, {
            id: uniqueId,
            subject: req.body.subject,
            opened: false,
            clicked: false
        });
    
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.error(error);
        });
        return res.status(200).json({ message: 'Correo electrónico enviado correctamente' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};