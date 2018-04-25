'use strict';

/**
 * Dependencies
 */
const isBoolean = require('./is-boolean');

/**
 * isBoolean()
 */
describe('isBoolean()', () => {
  it('should consider booleans a boolean', () => {
    expect(isBoolean(true)).to.be.true();
    expect(isBoolean(false)).to.be.true();
  });
  it('should not consider non-booleans a boolean', () => {
    expect(isBoolean(1)).to.be.false();
    expect(isBoolean(0)).to.be.false();
    expect(isBoolean(1.2)).to.be.false();
    expect(isBoolean(-2.4)).to.be.false();
    expect(isBoolean('a')).to.be.false();
    expect(isBoolean('0')).to.be.false();
    expect(isBoolean([])).to.be.false();
    expect(isBoolean({})).to.be.false();
    expect(isBoolean(null)).to.be.false();
    expect(isBoolean(undefined)).to.be.false();
    expect(isBoolean(NaN)).to.be.false();
  });
});
