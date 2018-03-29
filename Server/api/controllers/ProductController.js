/* eslint-disable*/
var mongoose = require('mongoose');
var moment = require('moment');
var Validations = require('../utils/validators/is-object-id');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');

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