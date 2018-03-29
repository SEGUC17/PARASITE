'use strict';

/**
 * Dependencies
 */
const isNegative = require('./is-negative');

/**
 * isNegative()
 */
describe('isNegative()', () => {
  it('should consider negative numbers negative', () => {
    expect(isNegative(-1)).to.be.true();
    expect(isNegative(-1.25)).to.be.true();
    expect(isNegative(-1000)).to.be.true();
  });
  it('should not consider positive numbers negative', () => {
    expect(isNegative(1)).to.be.false();
    expect(isNegative(1.25)).to.be.false();
    expect(isNegative(1000)).to.be.false();
  });
  it('should not consider zero negative', () => {
    expect(isNegative(0)).to.be.false();
  });
  it('should not consider non-numbers negative', () => {
    expect(isNegative(NaN)).to.be.false();
    expect(isNegative('a')).to.be.false();
    expect(isNegative('1')).to.be.false();
    expect(isNegative('0')).to.be.false();
    expect(isNegative('1.2')).to.be.false();
    expect(isNegative('-2.4')).to.be.false();
    expect(isNegative(true)).to.be.false();
    expect(isNegative(false)).to.be.false();
    expect(isNegative([])).to.be.false();
    expect(isNegative({})).to.be.false();
    expect(isNegative(null)).to.be.false();
    expect(isNegative(undefined)).to.be.false();
  });
});
