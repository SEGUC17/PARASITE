'use strict';

/**
 * Dependencies
 */
const checkEmpty = require('./helpers/check-empty');

/**
 * Check if not empty
 */
module.exports = function notEmpty(value) {
  if (checkEmpty(value)) {
    throw new Error('Expected non-empty value');
  }
};
