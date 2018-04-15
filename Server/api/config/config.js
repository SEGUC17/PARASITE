//TODO production URL to be added in deployment
module.exports = {
    EMAIL_REGEX: /\S+@\S+\.\S+/,
    ENV: 'dev',
    FACEBOOK_APP_ID: '258184358056648',
    FACEBOOK_APP_SECRET: 'fd8073c4d68acb0cd4cd58f540dfa5fd',
    //either dev or prod
    FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
    MAIL_ID: 'parasite.nawwar@gmail.com',
    MAIL_PW: 'ParaSiteNawwar',
    MONGO_URI: this.env === 'prod' ? '' : 'mongodb://localhost:27017/nawwar',
    PHONE_REGEX: /^\d+$/,
    SECRET: ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
var mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20
};
