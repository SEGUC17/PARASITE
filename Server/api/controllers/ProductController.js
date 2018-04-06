
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');


// get number of products in the DB
// restricted by delimiters given as a JSON object in the URL
module.exports.getNumberOfProducts = function (req, res, next) {
    var toFind = JSON.parse(req.params.limiters);
    var limiters = {};
    if (toFind.price) {
        limiters.price = { $lt: toFind.price };
    }
    if (toFind.name) {
        limiters.name = new RegExp(toFind.name, 'i');
    }
    if (toFind.seller) {
        limiters.seller = toFind.seller;
    }
    Product.find(limiters).count().
        exec(function (err, count) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: count,
                err: null,
                msg: 'Number of products = ' + count
            });
        });
};

// get the actual products in the DB
// restricted by delimiters given as a JSON object in the URL
module.exports.getMarketPage = function (req, res, next) {
    var toFind = JSON.parse(req.params.limiters);
    var limiters = {};
    if (toFind.price) {
        limiters.price = { $lt: toFind.price };
    }
    if (toFind.name) {
        limiters.name = new RegExp(toFind.name, 'i');
    }
    if (toFind.seller) {
        limiters.seller = toFind.seller;
    }
    Product.paginate(
        limiters,
        {
            limit: Number(req.params.entriesPerPage),
            page: Number(req.params.pageNumber)
        }, function (err, products) {
            if (err) {
                return next(err);
            }
            console.log(products);
            res.status(200).json({
                data: products,
                err: null,
                msg: 'products retrieved successfully'
            });
        }
    );
};

// get a product given its id
module.exports.getProduct = function (req, res, next) {
    if (!Validations.isObjectId(req.params.productId)) {
        return res.status(422).json({
            data: null,
            err: 'productId parameter must be a valid ObjectId.',
            msg: null
        });
    }
    Product.findById(req.params.productId).exec(function (err, product) {
        if (err) {
            return next(err);
        }
        if (!product) {
            return res.status(404).json({
                data: null,
                err: 'Product not found.',
                msg: null
            });
        }
        res.status(200).json({
            data: product,
            err: null,
            msg: 'Product retrieved successfully.'
        });
    });
};

module.exports.getRequests = function (req, res, next) {
    console.log('Got here');
    ProductRequest.find({}).exec(function (err, requests) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            data: requests,
            err: null,
            msg: 'Requests retrieved successfully.'
        });
    });
};
//createproduct

module.exports.createProduct = function (req, res, next) {
    if (!(typeof req.body.name === 'string')) {
        console.log('please insert product"s name as a string');
    }
    var valid =
        req.body.name &&
        req.body.price &&
        req.body.acquiringType &&
        req.body.image &&
        req.body.description;
    if (!valid) {
        return res.status(422).json({
            data: null,
            err: null,
            msg: 'name(String) price(Number) and acquiringType(String) and' +
                'image(String) and description(String) are required fields.'
        });
    }

    Product.create(req.body, function (err, product) {

        if (err) {
            return next(err);
        }
        res.status(201).json({
            data: product,
            err: null,
            msg: 'Product was created successfully.'
        });
    });
};
//createproduct end

// function readURL(input) {

//     if (input.files && input.files[0]) {
//       var reader = new FileReader();

//       reader.onload = function(e) {
//         $('#blah').attr('src', e.target.result);
//       }

//       reader.readAsDataURL(input.files[0]);
//     }
//   }

//   $('#imgInp').change(function() {
//     readURL(this);
//   });

//createProductRequest start
module.exports.createProductRequest = function (req, res, next) {
    ProductRequest.create(req.body, function (err, productreq) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            data: productreq,
            err: null,
            msg: 'ProductRequest was created successfully.'
        });
    });
};
//createProductRequest end


module.exports.evaluateRequest = function (req, res, next) {
    if (req.body.result) {
        console.log('Got here, True');
        var newProduct = {};

        // Ensure the request still exists
        ProductRequest.findById(req.body._id).exec(function (err, productReq) {
            if (err) {
                return next(err);
            }
            if (!productReq) {
                return res.status(404).
                    json({
                        data: null,
                        err: null,
                        msg: 'Request not found.'
                    });
            }
            // If found, make the newProduct to insert
            newProduct = {
                acquiringType: req.body.acquiringType,
                createdAt: req.body.createdAt,
                description: req.body.description,
                image: req.body.image,
                name: req.body.name,
                price: req.body.price,
                rentPeriod: req.body.rentPeriod,
                seller: req.body.seller
            };
            // Delete the request
            ProductRequest.deleteOne({ _id: req.body._id }, function
                 (err1, product) {
                if (err1) {
                    return next(err1);
                }
                // Insert the product
                Product.create(newProduct, function (err2, product1) {
                    if (err2) {
                        return next(err2);
                    }
                    res.status(201).json({
                        data: newProduct,
                        err: null,
                        msg: 'Request accepted and product added to database.'
                    });
                });
            });
        });
    } else {
        console.log(req.body._id);

        // Simply delete the request and notify the user
        ProductRequest.findByIdAndRemove(req.body._id, function (err, product) {
            if (err) {
                return next(err);
            }
            // TODO Notify user

            // When done, send response
            return res.status(200).json({
                data: product,
                err: null,
                msg: 'Request rejected and user notified.'
            });
        });
    }
};
