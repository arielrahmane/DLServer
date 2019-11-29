/*
    This is a dev file. You must copy this file and save it in this same folder with the name "credentials.js".
    
    To get this credentials, you must do it following the next article:
    https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
*/

const credentials = {
    client_user: "My_Email",
    client_id: "My_Google_Client_ID",
    client_secret: "My_Client_Secret",
    refresh_token: "My_Refresh_Token",
    redirect_URL: "https://developers.google.com/oauthplayground"
}

module.exports.credentials = credentials;