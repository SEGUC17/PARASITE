var mongoose = require('mongoose');

module.exports.test = function(req, res) {
    var testvalue = 'salma';
    res.status(200).json({
        data: testvalue,
        err: null,
        msg: 'AdminController work!'
    });
};


