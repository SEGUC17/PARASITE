'use strict';

/**
 * Is greater or equal than
 */
module.exports = function gte(value, check) {
  if (value < check) {
    throw new Error(`Expected value to be greater than or equal to ${check}`);
  }
};
