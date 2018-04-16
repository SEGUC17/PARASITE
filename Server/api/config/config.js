/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable object-shorthand */
/* eslint-disable complexity */

//TODO production URL to be added in deployment
module.exports = {
    EMAIL_REGEX: /\S+@\S+\.\S+/,
    //either dev or prod
    ENV: 'dev',
    FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
    MAIL_ID: 'parasite.nawwar@gmail.com',
    MAIL_PW: 'ParaSiteNawwar',
    MONGO_URI: process.env.DATABASE_URL || 'mongodb://localhost:27017/nawwar',
    PHONE_REGEX: /^\d+$/,
    SECRET: process.env.API_KEY || ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
var mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20
};
