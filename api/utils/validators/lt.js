'use strict';

/**
 * Is less than
 */
module.exports = function lt(value, check) {
  if (value >= check) {
    throw new Error(`Expected value to be less than ${check}`);
  }
};
