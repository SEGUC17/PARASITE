var mongoose = require('mongoose');
var Product = mongoose.model('Product'),
productSchema = Product.schema;

var productRequestSchema = mongoose.Schema({
    product: {
        required: true,
        type: [productSchema]
    }
});

mongoose.model('ProductRequest', productRequestSchema);