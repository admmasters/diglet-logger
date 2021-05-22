import { getCorrelationId } from '../correlation-id';

describe('correlationId', () => {
  it('should not have a correlationId for a string message', () => {
    let actual = getCorrelationId('Hey there!');
    expect(actual).toBeUndefined();
    actual = getCorrelationId({ message: 'Hello again' });
    expect(actual).toBeUndefined();
    actual = getCorrelationId(new Error('Hello error'));
    expect(actual).toBeUndefined();
  });

  it('should have a correlationId for an object with a correlationId property', () => {
    const actual = getCorrelationId({
      message: 'some message',
      correlationId: '123',
    });
    expect(actual).toBe('123');
  });

  it('should not have a correlationId for an error', () => {
    const actual = getCorrelationId(new Error('error'));
    expect(actual).toBeUndefined();
  });

  it('should have a correlationId for an object with an error and a correlationId', () => {
    const actual = getCorrelationId({
      error: new Error('error'),
      correlationId: '123',
    });
    expect(actual).toBe('123');
  });
});
