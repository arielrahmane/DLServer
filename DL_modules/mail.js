const nodemailer = require ('nodemailer');

function sendEmail(service, user, pass, from, to, fileName, filePath) {
    return new Promise(function(resolve, reject) {
        var transporter = nodemailer.createTransport({
            service: service,
            auth: {
                   user: user, //need to address security problems first
                   pass: pass
               }
        });
    
        const mailOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: 'OpenDL Data Excel', // Subject line
            html: '<p>Adjunto se encuentra el archivo Excel con los datos de todos los nodos.</p>', // plain text body
            attachments: [
                {
                    filename: fileName,
                    path: filePath // stream this file
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