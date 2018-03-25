'use strict';

/**
 * Helper to format an amount into currency
 */
module.exports = function(amount, symbol, absolute) {
  if (typeof symbol !== 'string') {
    symbol = '$';
  }
  if (absolute === true) {
    amount = Math.abs(amount);
  }
  return symbol + amount.toLocaleString('en-NZ', {
    style: 'decimal',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
