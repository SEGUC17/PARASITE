'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Check if given date and time are in the future
 */
module.exports = function isDateInFuture(date, time = 0) {
  if (!moment(date).setTime(time).isAfter(moment())) {
    throw new Error('Expected date to be in the future');
  }
};
