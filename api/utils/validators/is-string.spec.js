'use strict';

/**
 * Dependencies
 */
const isString = require('./is-string');

/**
 * isString()
 */
describe('isString()', () => {
  it('should consider strings a string', () => {
    expect(isString('test')).to.be.true();
    expect(isString('123')).to.be.true();
    expect(isString('true')).to.be.true();
  });
  it('should not consider non-string a string', () => {
    expect(isString(1)).to.be.false();
    expect(isString(0)).to.be.false();
    expect(isString(1.2)).to.be.false();
    expect(isString(-2.4)).to.be.false();
    expect(isString([])).to.be.false();
    expect(isString({})).to.be.false();
    expect(isString(true)).to.be.false();
    expect(isString(false)).to.be.false();
    expect(isString(null)).to.be.false();
    expect(isString(undefined)).to.be.false();
    expect(isString(NaN)).to.be.false();
  });
});
