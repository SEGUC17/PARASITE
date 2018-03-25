'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Check if given date is after another
 */
module.exports = function isDateAfter(date, check) {
  check = moment(check);
  if (!moment(date).isAfter(check)) {
    check = check.format('DD-MM-YYYY');
    throw new Error(`Expected date to be after ${check}`);
  }
};
