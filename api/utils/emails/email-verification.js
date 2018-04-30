/* eslint-disable */
// Useful Links:
// https://nodemailer.com/about/
// https://www.codementor.io/joshuaaroke/sending-html-message-in-nodejs-express-9i3d3uhjr

var secret = require('../secret');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    auth: {
        pass: secret.EMAIL.PW,
        user: secret.EMAIL.ID
    },
    service: secret.EMAIL.SERVICE
});

module.exports.send = function (email, link) {
    var mailOptions = {
        from: 'email-verification@nawwar.com',
        to: email,
        subject: 'Email Verification - Nawwar.com',
        html: '<b><a href="' + link + '">Verification Link</a></b>',
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
};


module.exports.adminReply = function (email, emailBody) {
    //console.log('reached adminReply');
   // console.log('body is: ',emailBody);
    var mailOptions = {
        from: 'email-verification@nawwar.com',
        to: email,
        subject: 'INQUIRY REPLY - Nawwar.com',
        text: emailBody,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
           // console.log('reached error of sendMail');
            console.log(err);
        }
    });
};
