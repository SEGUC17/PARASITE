'use strict';

/**
 * Is boolean
 */
module.exports = function isBoolean(value) {
  if (typeof value !== 'boolean') {
    throw new Error('Expected boolean value');
  }
};
