'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Object ID validator
 */
module.exports = function isObjectId(value) {

  //Handle arrays
  if (Array.isArray(value)) {
    if (!value.every(id => ObjectId.isValid(id))) {
      throw new Error(`Expected an array of ObjectId's`);
    }
  }

  //Single ID
  else if (!ObjectId.isValid(value)) {
    throw new Error('Expected an ObjectId');
  }
};
