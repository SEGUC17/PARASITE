'use strict';

/**
 * Dependencies
 */
const checkEmpty = require('./helpers/check-empty');

/**
 * Check if empty
 */
module.exports = function isEmpty(value) {
  if (!checkEmpty(value)) {
    throw new Error('Expected empty value');
  }
};
