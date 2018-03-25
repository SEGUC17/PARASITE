//TODO production URL to be added in deployment
module.exports = {
    //either dev or prod
    ENV: 'dev',
    MONGO_URI: this.env === 'prod' ? '' : 'mongodb://localhost:27017/nawwar',
    PORT: 3000,
    SECRET: 'placeholder'
};
