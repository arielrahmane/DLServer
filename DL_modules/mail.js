const nodemailer = require ('nodemailer');
const { google } = require("googleapis");
const { credentials } = require("../config/credentials");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    credentials.client_id, // ClientID
    credentials.client_secret, // Client Secret
    credentials.redirect_URL // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: credentials.refresh_token
});
const accessToken = oauth2Client.getAccessToken();

/*
    parameters = {
        to: String, //email destination
        fileName: String, //Name of the attached file
        filePath: String //Path to attached file
    }
 */
function sendEmail(parameters) {
    return new Promise(function(resolve, reject) {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: credentials.client_user, 
                clientId: credentials.client_id,
                clientSecret: credentials.client_secret,
                refreshToken: credentials.refresh_token,
                accessToken: accessToken
           }
        });
    
        const mailOptions = {
            from: credentials.client_user, // sender address
            to: parameters.to, // list of receivers
            subject: 'OpenDL Data Excel', // Subject line
            html: '<p>Adjunto se encuentra el archivo Excel con los datos del nodo seleccionado.</p>', // plain text body
            attachments: [
                {
                    filename: parameters.fileName,
                    path: parameters.filePath // stream this file
                }
            ]
          };
      
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                reject(err);
            else
                resolve(info);
        });
    });
}
  module.exports = {
    sendEmail
}