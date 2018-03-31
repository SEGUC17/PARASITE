'use strict';

/**
 * Check if empty
 */
module.exports = function checkEmpty(value) {

  //Check cases
  if (typeof value === 'undefined') {
    return true;
  }
  else if (value === null || value === '' || value === 0 || value === false) {
    return true;
  }
  else if (typeof value === 'string' && !value.match(/\S/)) {
    return true;
  }
  else if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }
  }
  else if (value instanceof Set || value instanceof Map) {
    if (value.size === 0) {
      return true;
    }
  }

  //Not empty
  return false;
};
