'use strict';

/**
 * To camel case
 */
module.exports = function toCamelCase(str, ucfirst) {
  if (typeof str === 'number') {
    return String(str);
  }
  else if (typeof str !== 'string') {
    return '';
  }
  if ((str = String(str).trim()) === '') {
    return '';
  }
  return str
    .replace(/_+|\-+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (Number(match) === 0) {
        return '';
      }
      return (index === 0 && !ucfirst) ?
        match.toLowerCase() : match.toUpperCase();
    });
};
