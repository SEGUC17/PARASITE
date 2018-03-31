'use strict';

/**
 * Check if empty
 */
module.exports = function checkEmpty(value) {

  //Check cases
  if (typeof value === 'undefined') {
    return true;
  }
<<<<<<< HEAD
  else if (value === null || value === '' || value === 0 || value === false) {
=======
  else if (value === null || value === '' || value === 0) {
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
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
