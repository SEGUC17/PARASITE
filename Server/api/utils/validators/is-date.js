'use strict';

/**
 * Is date
 */
module.exports = function isDate(value) {
    if (!(value instanceof Date && !isNaN(value.valueOf()))) {
      throw new Error('Expected date value');
    }
  };
