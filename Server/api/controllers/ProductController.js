/* eslint-disable */
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');
module.exports.getNumberOfProducts = function (req, res, next) {
    console.log('entered pages');
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
    ProductRequest.find({}).exec(function (err, products) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            data: products,
            err: null,
            msg: 'Products retrieved successfully.'
        });
    });
};
//createproduct

module.exports.createProduct = function (req, res, next) {

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

//createProductRequest start
module.exports.createProductRequest = function (req, res, next) {
    ProductRequest.create(req.body, function (err, productreq) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            data: productreq,
            err: null,
            msg: 'Product was created successfully.'
        });
    });
};
//createProductRequest end


module.exports.evaluateRequest = function (req, res, next) {
    if (req.body.result) {
        var newProduct;
        // Validate the productID
        if (!Validations.isObjectId(req.body.requestID)) {
            return res.status(422).json({
                data: null,
                err: null,
                msg: 'productID parameter must be a valid ObjectId.'
            });
        }

        // Ensure the request still exists
        ProductRequest.findById(req.body.requestId).exec(function (err, product) {
            if (err) {
                return next(err);
            }
            if (!product) {
                return res
                    .status(404)
                    .json({ err: null, msg: 'Product not found.', data: null });
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
            ProductRequest.deleteOne({ _id: req.body.requestID }, function (err, product) {
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
                        data: product
                    });
                });
            })
        });
    }
    else {
        if (!Validations.isObjectId(req.body.requestID)) {
            return res.status(422).json({
                data: null,
                err: null,
                msg: 'productID parameter must be a valid ObjectId.'
            });
        }
        // Simply delete the request and notify the user
        ProductRequest.findByIdAndRemove(req.body.requestID, function (err, product) {
            if (err) {
                return next(err);
            }
            // TODO Notify user

            // When done, send response
            res.status(200).json({
                err: null,
                msg: 'Request rejected and user notified.',
                data: product
            });
        })
    }
};