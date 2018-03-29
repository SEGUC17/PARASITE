'use strict';

/**
 * Dependencies
 */
const isInteger = require('./is-integer');

/**
 * isInteger()
 */
describe('isInteger()', () => {
  it('should consider integers an integer', () => {
    expect(isInteger(1)).to.be.true();
    expect(isInteger(500)).to.be.true();
    expect(isInteger(0)).to.be.true();
    expect(isInteger(-1)).to.be.true();
    expect(isInteger(-10000)).to.be.true();
  });
  it('should not consider non-integers an integer', () => {
    expect(isInteger(1.2)).to.be.false();
    expect(isInteger(-2.4)).to.be.false();
    expect(isInteger('a')).to.be.false();
    expect(isInteger('1')).to.be.false();
    expect(isInteger('0')).to.be.false();
    expect(isInteger('-1')).to.be.false();
    expect(isInteger(true)).to.be.false();
    expect(isInteger(false)).to.be.false();
    expect(isInteger([])).to.be.false();
    expect(isInteger({})).to.be.false();
    expect(isInteger(null)).to.be.false();
    expect(isInteger(undefined)).to.be.false();
    expect(isInteger(NaN)).to.be.false();
  });
});
