/* eslint-disable max-len */
/*eslint no-underscore-dangle: ["error", { "allow": ["__v","_id"] }]*/
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var ProductRequest = mongoose.model('ProductRequest');
var Messages = mongoose.model('Message');

var User = mongoose.model('User');
var moment = require('moment');

var limits = function (toFind) {

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

    return limiters;
};
var options = function (toFind, params) {

    var ret = {

        limit: Number(params.entriesPerPage),
        page: Number(params.pageNumber),
        sort: {}
    };
    if (toFind.sort) {
        if (toFind.sort === 'cheapest') {
            ret.sort.price = 1;
        }
        if (toFind.sort === 'latest') {
            ret.sort.createdAt = -1;
        }
    }

    return ret;
};

// get the actual products in the DB
// restricted by delimiters given as a JSON object in the URL
module.exports.getMarketPage = function (req, res, next) {

    var toFind = JSON.parse(req.params.limiters);
    // validations
    var valid = req.params.entriesPerPage && req.params.pageNumber &&
        (!toFind.price || !isNaN(toFind.price)) &&
        (!toFind.name || typeof toFind.name === 'string') &&
        (!toFind.seller || typeof toFind.seller === 'string') &&
        !isNaN(req.params.entriesPerPage) &&
        !isNaN(req.params.pageNumber);

    // the request was not valid
    if (!valid) {
        return res.status(422).json({
            data: null,
            err: 'The required fields were missing or of wrong type.',
            msg: null
        });
    }
    // extract the limiters out of the header
    var limiters = limits(toFind);
    // get the search options
    var opt = options(toFind, req.params);
    // get the products by pagination
    Product.paginate(
        limiters,
        opt,
        function (err, products) {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                data: products,
                err: null,
                msg: 'products retrieved successfully'
            });
        }
    );
};

// Get the products requests in the database
module.exports.getRequests = function (req, res, next) {
    if (req.user.isAdmin) {
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
    } else {
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that.',
            msg: null
        });
    }
};

// createproduct
module.exports.createProduct = function (req, res, next) {
    //Validity check
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
    // If the user is an admin then create product
    if (req.user.isAdmin) {
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
    } else {
        //If user is not an Admin
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that',
            msg: null
        });
    }
};
//createproduct end

// createProductRequest start
module.exports.createProductRequest = function (req, res, next) {
    console.log(req.body);
    ProductRequest.create(req.body, function (err, productreq) {
        if (err) {
            return next(err);
        }
        //Created successfully
        res.status(200).json({
            data: productreq,
            err: null,
            msg: 'ProductRequest was created successfully.'
        });
    });
};
// createProductRequest end


module.exports.evaluateRequest = function (req, res, next) {
    if (req.user.isAdmin) {
        if (req.body.result) {
            var newProduct = {};
            // Ensure the request still exists
            ProductRequest.findById(req.body._id).exec(function (err, productReq) {
                if (err) {
                    return next(err);
                }
                if (!productReq) {
                    return res.status(404).json({
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
                ProductRequest.deleteOne({ _id: req.body._id }, function (error) {
                    if (error) {
                        return next(error);
                    }
                    // Insert the product
                    Product.create(newProduct, function (error1) {
                        if (error1) {
                            return next(error1);
                        }
                        var notification = {
                            body: 'Your new product was approved. your product is now on the market',
                            date: moment().toDate(),
                            itemId: newProduct._id,
                            type: 'product'
                        };
                        User.findOneAndUpdate(
                            { username: newProduct.seller },
                            {
                                $push:
                                    { 'notifications': notification }
                            }
                            , { new: true },
                            function (errr, updatedUser) {
                                console.log('add the notification');
                                console.log(updatedUser.notifications);
                                if (errr) {
                                    return res.status(402).json({
                                        data: null,
                                        err: 'error occurred during adding ' +
                                            'the notification'
                                    });
                                }
                                if (!updatedUser) {
                                    return res.status(404).json({
                                        data: null,
                                        err: null,
                                        msg: 'User not found.'
                                    });
                                }
                            }
                        );
                        res.status(201).json({
                            data: newProduct,
                            err: null,
                            msg: 'Request accepted and product added to database.'
                        });
                    });
                });
            });
        } else {
            // Simply delete the request and notify the user
            ProductRequest.findByIdAndRemove(req.body._id, function (err) {
                if (err) {
                    return res.status(404).json({
                        data: null,
                        err: null,
                        msg: 'Request not found.'
                    });
                }

                // Notify user
                var body = 'Your request to add ' + req.body.name + ' to the Marketplace was rejected';
                Messages.create({
                    body: body,
                    recepient: req.body.seller,
                    sender: 'Admin'
                }, function (msgErr) {
                    if (msgErr) {
                        return console.log(err);
                    }
                });

                // When done, send response

                return res.status(200).json({
                    data: null,
                    err: null,
                    msg: 'Request rejected and user notified.'
                });
            });
        }
    } else {
        return res.status(403).json({
            data: null,
            err: 'You are not an admin OR you are not signed in',
            msg: null
        });
    }
};

module.exports.getUserRequests = function (req, res, next) {
    if (req.user.username === req.params.username) {
        ProductRequest.find({ seller: req.user.username }).exec(function (err, prodRequests) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: prodRequests,
                err: null,
                msg: 'Requests retrieved.'
            });
        });
    } else {
        return res.status(403).json({
            data: null,
            err: 'You can only view your requests',
            msg: null
        });
    }
};

module.exports.updateRequest = function (req, res, next) {
    // Ensure that the user is editing his own request
    if (req.user.username === req.params.username) {

        // Delete of the sensitive data that can't be edited by the user
        delete req.body.createdAt;
        delete req.body.seller;
        delete req.body.__v;
        delete req.body._id;

        // Update the request in the database
        ProductRequest.updateOne({ _id: req.params.id }, { $set: req.body }).exec(function (err, updateRes) {
            if (err) {
                return next(err);
            }

            return res.status(201).json({
                data: updateRes,
                err: null,
                msg: 'Request updated.'
            });
        });
    } else {
        // Send a 403 Unauthorized HTTP response
        return res.status(403).json({
            data: null,
            err: 'You can only edit your requests',
            msg: null
        });
    }
};

module.exports.editPrice = function (req, res, next) {
    if (req.body.seller === req.params.username) {
        Product.updateOne({ _id: req.params.id }, { $set: { price: req.body.price } }).exec(function (err, updateProd) {
            if (err) {
                return next(err);
            }

            return res.status(201).json({
                data: updateProd,
                err: null,
                msg: 'product price updated.'
            });
        });
    } else {
        return res.status(403).json({
            data: null,
            err: 'You can only edit your product',
            msg: null
        });
    }
};

module.exports.deleteProduct = function (req, res, next) {
    // if user is admin so allowed to delete any product from market
    // if user is not admin so he is only allowed to delete his own product
    if (req.user.isAdmin || req.user.username === req.body.product.seller) {

        Product.deleteOne({ _id: req.body.product._id }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(201).json({
                data: null,
                err: null,
                msg: 'Product was deleted successfully.'
            });
            // TODO: Notify user

            // When user's product is deleted
        });
    } else {
        // Otherwise, an Unauthorised response is sent
        res.status(403).json({
            data: null,
            err: 'You are not an admin to do that.',
            msg: null
        });

    }
};
