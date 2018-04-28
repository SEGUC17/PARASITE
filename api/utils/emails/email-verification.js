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

module.exports.sendPsychID = function (email, id) {
    var mailOptions = {
        from: 'email-verification@nawwar.com',
        to: email,
        subject: 'Your request was accepted!! - Nawwar.com',
        html: '<b><h2> Welcome to our family,</h2>'
            + '<p> your request to add your information to our verified psychologists was accepted. Your ID: ' +
            id + ' , keep this ID so you can use it later to edit or delete your information.' + '</p> <br>'
            + '<span> best Regards,<span><br><span> Nawwar <span>'
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
    });
};
