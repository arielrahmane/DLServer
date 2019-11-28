const nodemailer = require ('nodemailer');

function sendEmail() {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'setEmail', //need to address security problems first
               pass: 'setPassword'
           }
    });

    const mailOptions = {
        from: 'arielrahmane@gmail.com', // sender address
        to: 'arielrahmane@gmail.com', // list of receivers
        subject: 'Test Excel OpenDL', // Subject line
        html: '<p>Esto es un test de OpenDL</p>', // plain text body
        attachments: [
            {
                filename: 'nodos_data.xlsx',
                path: '/home/pi/Documents/DLServer/nodos_data.xlsx' // stream this file
            }
        ]
      };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });

  }

  module.exports = {
    sendEmail
}