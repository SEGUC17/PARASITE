'use strict';

/**
 * Dependencies
 */
const moment = require('moment');

/**
 * Helper to format a moment into a date
 */
module.exports = function(date, format, relative) {

  //Ensure input is valid
  if (typeof format !== 'string' || !format) {
    format = 'DD-MM-YYYY';
  }
  if (typeof relative !== 'boolean') {
    relative = false;
  }
  if (!moment.isMoment(date)) {
    date = moment(date);
  }

  //If relative, check if today or tomorrow
  if (relative) {
    const now = moment();
    if (now.isSame(date, 'day')) {
      return 'Today';
    }
    if (now.add(1, 'day').isSame(date, 'day')) {
      return 'Tomorrow';
    }
  }

  //Return date as format
  return date.format(format);
};
