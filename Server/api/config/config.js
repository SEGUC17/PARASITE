//TODO production URL to be added in deployment
module.exports = {
    EMAIL_REGEX: /\S+@\S+\.\S+/,
    //either dev or prod
    FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
    ENV: 'dev',
    MONGO_URI: process.env.DATABASE_URL || 'mongodb://localhost:27017/nawwar',
    PHONE_REGEX: /^\d+$/,
    SECRET: process.env.API_KEY || ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
var mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20
};
