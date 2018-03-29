/* eslint-disable*/
var mongoose = require('mongoose'),
Product = mongoose.model('Product'),
productSchema = Product.schema;

var productRequestSchema = mongoose.Schema({
    product: {
        required: true,
        type: [productSchema]
    }
});