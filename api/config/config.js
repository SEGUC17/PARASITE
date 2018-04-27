/* eslint-disable max-len */

//TODO production URL to be added in deployment
module.exports = {
    ENV: 'dev',
    FRONTEND_URI: process.env.FRONTEND_URI || 'http://localhost:4200/',
    EMAIL_ID: 'parasite.nawwar@gmail.com',
    EMAIL_PW: 'ParaSiteNawwar',
    MONGO_URI: process.env.DATABASE_URL || 'mongodb://localhost:27017/nawwar',
//    MONGO_URI: this.env === 'prod' ? '' : 'mongodb://localhost:27017/nawwar',
    SECRET: process.env.API_KEY || ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
var mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20
};
