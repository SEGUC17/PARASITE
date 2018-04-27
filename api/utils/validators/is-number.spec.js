'use strict';

/**
 * Dependencies
 */
const isNumber = require('./is-number');

/**
 * isNumber()
 */
describe('isNumber()', () => {
  it('should consider numbers a number', () => {
    expect(isNumber(1)).to.be.true();
    expect(isNumber(500)).to.be.true();
    expect(isNumber(0)).to.be.true();
    expect(isNumber(-1)).to.be.true();
    expect(isNumber(-10000)).to.be.true();
    expect(isNumber(1.2)).to.be.true();
    expect(isNumber(-2.4)).to.be.true();
  });
  it('should not consider non-numbers a number', () => {
    expect(isNumber(NaN)).to.be.false();
    expect(isNumber('a')).to.be.false();
    expect(isNumber('1')).to.be.false();
    expect(isNumber('0')).to.be.false();
    expect(isNumber('1.2')).to.be.false();
    expect(isNumber('-2.4')).to.be.false();
    expect(isNumber(true)).to.be.false();
    expect(isNumber(false)).to.be.false();
    expect(isNumber([])).to.be.false();
    expect(isNumber({})).to.be.false();
    expect(isNumber(null)).to.be.false();
    expect(isNumber(undefined)).to.be.false();
  });
});
