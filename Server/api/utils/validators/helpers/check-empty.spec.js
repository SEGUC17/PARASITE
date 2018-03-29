'use strict';

/**
 * Dependencies
 */
const checkEmpty = require('./check-empty');

/**
 * checkEmpty()
 */
describe('checkEmpty()', () => {
  it('should consider null and undefined empty', () => {
    expect(checkEmpty(null)).to.be.true();
    expect(checkEmpty(undefined)).to.be.true();
  });
  it('should consider empty strings as empty', () => {
    expect(checkEmpty('')).to.be.true();
  });
  it('should consider strings with only spaces as empty', () => {
    expect(checkEmpty('  ')).to.be.true();
  });
  it('should consider strings with only whitespace characters empty', () => {
    expect(checkEmpty('\n\r')).to.be.true();
    expect(checkEmpty('\n\r \n\n')).to.be.true();
  });
  it('should consider zero as empty', () => {
    expect(checkEmpty(0)).to.be.true();
  });
  it('should consider false as empty', () => {
    expect(checkEmpty(false)).to.be.true();
  });
  it('should consider empty arrays as empty', () => {
    expect(checkEmpty([])).to.be.true();
  });
  it('should consider an empty set as empty', () => {
    expect(checkEmpty(new Map())).to.be.true();
  });
  it('should consider an empty map as empty', () => {
    expect(checkEmpty(new Set())).to.be.true();
  });
  it('should not consider strings with length as empty', () => {
    expect(checkEmpty('test')).to.be.false();
  });
  it('should not consider true as empty', () => {
    expect(checkEmpty(true)).to.be.false();
  });
  it('should not consider non zero numbers as empty', () => {
    expect(checkEmpty(1)).to.be.false();
    expect(checkEmpty(-1)).to.be.false();
    expect(checkEmpty(1.1)).to.be.false();
  });
  it('should not consider non-empty arrays as empty', () => {
    expect(checkEmpty(['test'])).to.be.false();
    expect(checkEmpty([''])).to.be.false();
    expect(checkEmpty([0])).to.be.false();
    expect(checkEmpty([null])).to.be.false();
  });
  it('should not consider an object as empty', () => {
    expect(checkEmpty({})).to.be.false();
  });
  it('should not consider a function as empty', () => {
    expect(checkEmpty(checkEmpty)).to.be.false();
  });
});
