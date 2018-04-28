'use strict';

/**
 * Is array
 */
module.exports = function isArray(value) {
  if (!Array.isArray(value)) {
    throw new Error('Expected array value');
  }
};
