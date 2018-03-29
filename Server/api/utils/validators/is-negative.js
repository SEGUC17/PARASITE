'use strict';

/**
 * Is negative
 */
module.exports = function isNegative(value) {
  if (value >= 0) {
    throw new Error('Expected negative value');
  }
};
