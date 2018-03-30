/* eslint-disable*/
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');
module.exports.getNumberOfMarketPages = function (req, res, next) {
    var toFind = {};
    if (req.params.price) {
        if (req.params.name) {
            toFind = {
                price: { $lt: req.params.price },
                name: req.params.name
            };
        }
        else {
            toFind = { price: { $lt: req.params.price } };
        }
    }
    else {
        if (req.params.name) {
            toFind = { name: req.params.name };
        }
    }
    Product.find(toFind).count().
        exec(function (err, count) {
            var numberOfPages =
                Math.ceil(count / req.params.numberOfEntriesPerPage);

            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: numberOfPages,
                err: null,
                msg: 'Number of pages was retrieved'
            });
        });
};

module.exports.getMarketPage = function (req, res, next) {
    var toFind = {};
    if (req.params.price) {
        if (req.params.name) {
            toFind = {
                price: { $lt: req.params.price },
                name: req.params.name
            };
        }
        else {
            toFind = { price: { $lt: req.params.price } };
        }
    }
    else {
        if (req.params.name) {
            toFind = { name: req.params.name };
        }
    }
    var pageNumber = req.params.pageNumber;
    var numberOfEntriesPerPage = req.params.numberOfEntriesPerPage;
    Product.find(toFind).skip((pageNumber - 1) * numberOfEntriesPerPage).
        limit(numberOfEntriesPerPage).
        exec(function (err, contents) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'Page retrieved successfully'
            });
        });

};
module.exports.getProduct = function (req, res, next) {
    if (!Validations.isObjectId(req.params.productId)) {
        return res.status(422).json({
            err: 'productId parameter must be a valid ObjectId.',
            msg: null,
            data: null
        });
    }
    Product.findById(req.params.productId).exec(function (err, product) {
        if (err) {
            return next(err);
        }
        if (!product) {
            return res
                .status(404)
                .json({ err: 'Product not found.', msg: null, data: null });
        }
        res.status(200).json({
            err: null,
            msg: 'Product retrieved successfully.',
            data: product
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
            err: null,
            msg: 'Product was created successfully.',
            data: product
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
            err: null,
            msg: 'Product was created successfully.',
            data: productreq
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