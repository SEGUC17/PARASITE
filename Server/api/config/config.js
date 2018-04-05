//TODO production URL to be added in deployment
module.exports = {
    EMAIL_REGEX: /\S+@\S+\.\S+/,
    //either dev or prod
    ENV: 'dev',
    MONGO_URI: this.env === 'prod' ? '' : 'mongodb://localhost:27017/nawwar',
    PHONE_REGEX: /^\d+$/,
    SECRET: ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
