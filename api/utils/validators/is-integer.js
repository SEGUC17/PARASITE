'use strict';

/**
 * Is integer
 */
module.exports = function isInteger(value) {
  if (!Number.isInteger(value)) {
    throw new Error('Expected integer value');
  }
};
