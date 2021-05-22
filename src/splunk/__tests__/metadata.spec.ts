import { getMetadata } from '../metadata';

describe('getMetadata', () => {
  it('should not have metadata by default', () => {
    let actual = getMetadata('Hey there!');
    expect(actual).toBeUndefined();
    actual = getMetadata({ message: 'Hello again' });
    expect(actual).toBeUndefined();
    actual = getMetadata(new Error('Hello error'));
    expect(actual).toBeUndefined();
  });

  it('should have metadata when passed an object with a metadata property', () => {
    const actual = getMetadata({
      message: 'some message',
      metadata: {
        browser: 'Edge v.90',
        country: 'UK',
      },
    });
    expect(actual).toEqual({
      browser: 'Edge v.90',
      country: 'UK',
    });
  });
});
