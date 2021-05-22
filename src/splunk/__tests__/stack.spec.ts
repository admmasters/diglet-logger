import { getStack } from '../stack';

describe('getStack', () => {
  it('should not have a stack by default', () => {
    let actual = getStack('Hey there!');
    expect(actual).toBeUndefined();
    actual = getStack({ message: 'Hello again' });
    expect(actual).toBeUndefined();
  });

  it('should be able to transform a stack from an error', () => {
    let actual = getStack(new Error('Hello world'));
    expect(actual!.length).toBeGreaterThan(1);
  });

  it('should be able to transform a stack from an object with a stack property', () => {
    let actual = getStack({ message: 'something', stack: 'Stack!' });
    expect(actual).toBe('Stack!');
  });
});
