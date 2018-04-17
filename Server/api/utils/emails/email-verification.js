/* eslint-disable */
// Useful Links:
// https://nodemailer.com/about/
// https://www.codementor.io/joshuaaroke/sending-html-message-in-nodejs-express-9i3d3uhjr

var config = require('../../config/config');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    auth: {
        pass: config.MAIL_PW,
        user: config.MAIL_ID
    },
    service: 'gmail'
});

module.exports.sendEmailVerification = function (email, link) {
    var mailOptions = {
        from: 'email-verification@nawwar.com',
        to: email,
        subject: 'Email Verification - Nawwar.com',
        text: 'Verification Link: ' + link,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
};
