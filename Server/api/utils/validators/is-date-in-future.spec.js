'use strict';

/**
 * Dependencies
 */
const moment = require('moment');
const isDateInFuture = require('./is-date-in-future');

/**
 * Specification
 */
describe('isDateInFuture()', () => {
  const now = moment();
  it('should validate future dates', () => {
    expect(isDateInFuture(now.clone().add(1, 'year'), 0)).to.be.true();
    expect(isDateInFuture(now.clone().add(1, 'month'), 0)).to.be.true();
    expect(isDateInFuture(now.clone().add(1, 'day'), 60)).to.be.true();
  });
  it('should invalidate past dates', () => {
    expect(isDateInFuture(now.clone().subtract(1, 'year'), 0)).to.be.false();
    expect(isDateInFuture(now.clone().subtract(1, 'month'), 0)).to.be.false();
    expect(isDateInFuture(now.clone().subtract(1, 'day'), 60)).to.be.false();
  });
  it('should validate future times', () => {
    const time = now.clone().add(1, 'hour').getTime();
    expect(isDateInFuture(now, time)).to.be.true();
  });
  it('should invalidate past times', () => {
    const time = now.clone().subtract(1, 'hour').getTime();
    expect(isDateInFuture(now, time)).to.be.false();
  });
});
