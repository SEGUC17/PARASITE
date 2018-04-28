// ---------------------- Requirements ---------------------- //
var bcrypt = require('bcryptjs');
// ---------------------- End of Requirements ---------------------- //


// ---------------------- Encryption ---------------------- //
module.exports.hashPassword = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return callback(err, null);
    }
    bcrypt.hash(password, salt, function(err2, hash) {
      callback(err2, hash);
    });
  });
};
module.exports.comparePasswordToHash = function(
  candidatePassword,
  hash,
  callback
) {
  bcrypt.compare(candidatePassword, hash, function(err, matches) {
    callback(err, matches);
  });
};
// ---------------------- End of Encryption ---------------------- //
