import { isPlainObject } from '../utils';

describe('isPlainObject', () => {
  it('should return true for an object', function () {
    expect(isPlainObject({})).toBeTruthy();
  });

  it('should return true for an error - which we treat as an object', function () {
    expect(isPlainObject(new Error())).toBeTruthy();
  });

  it('should return false for remaining object types', function () {
    expect(isPlainObject(1)).toBeFalsy();
    expect(isPlainObject('Hello')).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
    expect(isPlainObject(Symbol('diglet'))).toBeFalsy();
  });
});
