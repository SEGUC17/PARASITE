'use strict';

/**
 * Is positive
 */
module.exports = function isPositive(value) {
  if (value <= 0) {
    throw new Error('Expected positive value');
  }
};
