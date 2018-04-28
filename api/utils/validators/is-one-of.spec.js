'use strict';

/**
 * Dependencies
 */
const isOneOf = require('./is-one-of');

/**
 * isOneOf()
 */
describe('isOneOf()', () => {
  it('should return true if a value is present', () => {
    expect(isOneOf(1, [1, 2, 3])).to.be.true();
    expect(isOneOf(1, [3, 2, 1])).to.be.true();
    expect(isOneOf('a', [1, 'a', 3])).to.be.true();
    expect(isOneOf(true, [true, false])).to.be.true();
    expect(isOneOf(null, ['a', null, 2])).to.be.true();
  });
  it('should return false if a value is not present', () => {
    expect(isOneOf(1, [4, 'a', true])).to.be.false();
    expect(isOneOf(null, [4, 'a', false])).to.be.false();
    expect(isOneOf('a', [1, 'b', 'c'])).to.be.false();
    expect(isOneOf(true, [null, false, 1])).to.be.false();
  });
});
