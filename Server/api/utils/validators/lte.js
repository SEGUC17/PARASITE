'use strict';

/**
 * Is less or equal than
 */
module.exports = function lte(value, check) {
  if (value > check) {
    throw new Error(`Expected value to be less than or equal to ${check}`);
  }
};
