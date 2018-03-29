'use strict';

/**
 * Is greater than
 */
module.exports = function gt(value, check) {
  if (value <= check) {
    throw new Error(`Expected value to be greater than ${check}`);
  }
};
