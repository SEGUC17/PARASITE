module.exports = function generateString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var index = 0; index < length; index += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};
