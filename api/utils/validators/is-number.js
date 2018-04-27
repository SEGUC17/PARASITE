'use strict';

/**
 * Is a number
 */
module.exports = function isNumber(value) {
  const float = parseFloat(value);
  if (typeof value === 'string' || isNaN(float) || !isFinite(value)) {
    throw new Error('Expected value to be a number');
  }
};
