'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Helper to format a moment into a date
 */
module.exports = function(date) {
  if (!moment.isMoment(date)) {
    return '';
  }

  //Get difference in days
  const days = date.diff(moment(), 'days');

  //If more than a day away, use relative time
  if (days > 1) {
    return date.fromNow();
  }
  if (days < -1) {
    return date.toNow();
  }
  return 'today';
};
