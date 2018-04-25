'use strict';

/**
 * Is string
 */
module.exports = function isString(value) {
  if (typeof value !== 'string') {
    throw new Error('Expected string value');
  }
};
