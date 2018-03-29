'use strict';

/**
 * Check if value is one of a given set
 */
module.exports = function isOneOf(value, values) {
  const set = new Set(values);
  set.add(value);
  if (values.length !== set.size) {
    values = values.join(', ');
    throw new Error(`Expected values to be one of: ${values}`);
  }
};
