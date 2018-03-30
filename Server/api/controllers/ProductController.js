/* eslint-disable */
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');
module.exports.getNumberOfMarketPages = function (req, res, next) {
    var toFind = {};
    if (req.body.price) {
        if (req.body.name) {
            toFind = {
                name: req.body.name,
                price: { $lt: req.body.price }
            };
        } else {
            toFind = { price: { $lt: req.body.price } };
        }
    } else if (req.body.name) {
        toFind = { name: req.body.name };
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
    var pageNumber = { num: req.params.pageNumber };
    var numberOfEntriesPerPage = { num: req.params.numberOfEntriesPerPage };
    if (req.body.price) {
        if (req.body.name) {
            toFind = {
                name: req.body.name,
                price: { $lt: req.body.price }
            };
        } else {
            toFind = { price: { $lt: req.body.price } };
        }
    } else if (req.body.name) {
        toFind = { name: req.body.name };
    }
    Product.find(toFind).
        skip((pageNumber.num - 1) * numberOfEntriesPerPage.num).
        limit(numberOfEntriesPerPage.num).
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
            msg: 'Product Request was created successfully.'
        });
    });
};
//createProductRequest end


module.exports.evaluateRequest = function (req, res, next) {
    console.log('Got here');
    if (req.body.result) {
        var newProduct;
        // Validate the productID
        if (!Validations.isObjectId(req.body._id)) {
            return res.status(422).json({
                data: null,
                err: 'productID parameter must be a valid ObjectId.',
                msg: null
            });
        }

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
                Product.insertOne(newProduct, function (err, product) {
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
        if (!Validations.isObjectId(req.body._id)) {
            return res.status(422).json({
                data: null,
                err: null,
                msg: 'productID parameter must be a valid ObjectId.'
            });
        }
        console.log('Got here');
        // Simply delete the request and notify the user
        ProductRequest.findByIdAndRemove(req.body._id, function (err, product) {
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