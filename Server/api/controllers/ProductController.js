/* eslint-disable */
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');

module.exports.getNumberOfProducts = function (req, res, next) {
    var toFind = {};
    var reqPrice = Number(req.params.price);
    var reqName = req.params.name;
    if (reqPrice !== 0) {
        if (reqName === 'NA') {
            toFind = { price: { $lt: reqPrice } };
        } else {
            toFind = {
                name: reqName,
                price: { $lt: reqPrice }
            };
        }
    } else if (reqName !== 'NA') {
        toFind = { name: reqName };
    }
    Product.find(toFind).count().
        exec(function (err, count) {
            if (err) {
                return next(err);
            }
            console.log(count + ' number of products');
            return res.status(200).json({
                data: count,
                err: null,
                msg: 'Number of products = ' + count
            });
        });
};

module.exports.getMarketPage = function (req, res, next) {
    var toFind = {};
    var reqPrice = Number(req.params.price);
    var reqName = req.params.name;
    if (reqPrice !== 0) {
        if (reqName === 'NA') {
            toFind = { price: { $lt: reqPrice } };
        } else {
            toFind = {
                name: reqName,
                price: { $lt: reqPrice }
            };
        }
    } else if (reqName !== 'NA') {
        toFind = { name: reqName };
    }
    Product.paginate(
        toFind,
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
module.exports.getNumberOfProductsBySeller = function (req, res, next) {
    Product.find({ seller: req.params.seller }).count().
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
module.exports.getMarketPageBySeller = function (req, res, next) {
    Product.paginate(
        { seller: req.params.seller },
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
        console.log("please insert product's name as a string")
    }
    var valid =
        req.body.name &&
        req.body.price &&
        req.body.acquiringType &&
        req.body.image &&
        req.body.description;
    if (!valid) {
        return res.status(422).json({
            err: null,
            msg: 'name(String) price(Number) and acquiringType(String) and image(String) and description(String) are required fields.',
            data: null
        });
    }

    Product.create(req.body, function (err, product) {

        if (err) {
            return next(err);
        }
        res.status(201).json({
            err: null,
            msg: 'Product was created successfully.',
            data: product
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

//   $("#imgInp").change(function() {
//     readURL(this);
//   });

//createProductRequest start
module.exports.createProductRequest = function (req, res, next) {
    ProductRequest.create(req.body, function (err, productreq) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            err: null,
            msg: 'ProductRequest was created successfully.',
            data: productreq
        });
    });
};
//createProductRequest end


module.exports.evaluateRequest = function (req, res, next) {
    if (req.body.result) {
        console.log('Got here, True');
        var newProduct;

        // Ensure the request still exists
        ProductRequest.findById(req.body._id).exec(function (err, productReq) {
            if (err) {
                return next(err);
            }
            if (!productReq) {
                return res
                    .status(404)
                    .json({ err: null, msg: 'Request not found.', data: null });
            }
            // If found, make the newProduct to insert
            newProduct = {
                name: req.body.name,
                price: req.body.price,
                seller: req.body.seller,
                image: req.body.image,
                acquiringType: req.body.acquiringType,
                rentPeriod: req.body.rentPeriod,
                description: req.body.description,
                createdAt: req.body.createdAt
            };
            // Delete the request
            ProductRequest.deleteOne({ _id: req.body._id }, function (err, product) {
                if (err) {
                    return next(err);
                }
                // Insert the product
                Product.create(newProduct, function (err, product) {
                    if (err) {
                        return next(err);
                    }
                    res.status(201).json({
                        err: null,
                        msg: 'Request accepted and product added to database.',
                        data: newProduct
                    });
                });
            })
        });
    }
    else {
        console.log(req.body._id);

        // Simply delete the request and notify the user
        ProductRequest.findByIdAndRemove(req.body._id, function (err, product) {
            if (err) {
                return next(err);
            }
            // TODO Notify user

            // When done, send response
            return res.status(200).json({
                err: null,
                msg: 'Request rejected and user notified.',
                data: product
            });
        })
    }
};