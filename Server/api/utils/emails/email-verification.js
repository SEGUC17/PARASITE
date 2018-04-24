/* eslint-disable */
// Useful Links:
// https://nodemailer.com/about/
// https://www.codementor.io/joshuaaroke/sending-html-message-in-nodejs-express-9i3d3uhjr

var config = require('../../config/config');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    auth: {
        pass: config.EMAIL_PW,
        user: config.EMAIL_ID
    },
    service: 'gmail'
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
