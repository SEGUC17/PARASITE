'use strict';

/**
 * Dependencies
 */
const isPositive = require('./is-positive');

/**
 * isPositive()
 */
describe('isPositive()', () => {
  it('should consider positive numbers positive', () => {
    expect(isPositive(1)).to.be.true();
    expect(isPositive(1.25)).to.be.true();
    expect(isPositive(1000)).to.be.true();
  });
  it('should not consider negative numbers positive', () => {
    expect(isPositive(-1)).to.be.false();
    expect(isPositive(-1.25)).to.be.false();
    expect(isPositive(-1000)).to.be.false();
  });
  it('should not consider zero positive', () => {
    expect(isPositive(0)).to.be.false();
  });
  it('should not consider non-numbers positive', () => {
    expect(isPositive(NaN)).to.be.false();
    expect(isPositive('a')).to.be.false();
    expect(isPositive('1')).to.be.false();
    expect(isPositive('0')).to.be.false();
    expect(isPositive('1.2')).to.be.false();
    expect(isPositive('-2.4')).to.be.false();
    expect(isPositive(true)).to.be.false();
    expect(isPositive(false)).to.be.false();
    expect(isPositive([])).to.be.false();
    expect(isPositive({})).to.be.false();
    expect(isPositive(null)).to.be.false();
    expect(isPositive(undefined)).to.be.false();
  });
});
