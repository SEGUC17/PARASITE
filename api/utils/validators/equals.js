'use strict';

/**
 * Equals
 */
module.exports = function equals(value, check) {
  if (value !== check) {
    throw new Error(`Expected value to equal ${check}`);
  }
};
