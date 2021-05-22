import { getMessage } from '../message';

describe('getMessage', () => {
  it('should be able to transform a string message', () => {
    const actual = getMessage('Hello world');
    expect(actual).toBe('Hello world');
  });

  it('should be able to transform an object with a message property', () => {
    const actual = getMessage({ message: 'Hello world' });
    expect(actual).toBe('Hello world');
  });

  it('should be able to get a message from an error', () => {
    const actual = getMessage(new Error('Hello error'));
    expect(actual).toBe('Hello error');
  });

  it('should be able to get a message from an error property', () => {
    const actual = getMessage({
      error: new Error('Hello error'),
      correlationId: '123',
    });
    expect(actual).toBe('Hello error');
  });
});
