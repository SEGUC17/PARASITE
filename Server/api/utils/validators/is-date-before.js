'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Check if given date is before another
 */
module.exports = function isDateBefore(date, check) {
  check = moment(check);
  if (!moment(date).isBefore(check)) {
    check = check.format('DD-MM-YYYY');
    throw new Error(`Expected date to be before ${check}`);
  }
};
