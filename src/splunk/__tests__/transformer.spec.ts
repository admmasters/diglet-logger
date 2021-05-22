import { coreTransformer, transformer } from '../transformer';

const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00.000Z';

beforeEach(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
});

afterAll(() => {
  jest.useRealTimers();
});

describe.each([
  ['DEBUG' as const, FIXED_SYSTEM_TIME],
  ['INFO' as const, FIXED_SYSTEM_TIME],
  ['WARN' as const, FIXED_SYSTEM_TIME],
  ['ERROR' as const, FIXED_SYSTEM_TIME],
])(
  'core transformer for %s level should have a timestamp: ',
  (logLevel, timestamp) => {
    it('should return some core message fields', () => {
      const actual = coreTransformer(logLevel);
      expect(actual.level).toBe(logLevel);
      expect(actual.time).toBe(timestamp);
    });
  }
);

describe('transformer', () => {
  it('should transform the message types we care about: ', () => {
    let actual = transformer('Hello World');
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "correlation_id": undefined,
        "message": "Hello World",
        "metadata": undefined,
        "stack": undefined,
      }
    `);

    actual = transformer(new Error('Hello error'));
    expect(actual.message).toBe('Hello error');
    expect(actual.stack!.length).toBeGreaterThan(0);

    actual = transformer({ message: 'Hello message', correlationId: '123' });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "correlation_id": "123",
        "message": "Hello message",
        "metadata": undefined,
        "stack": undefined,
      }
    `);

    actual = transformer({
      message: 'Hello message',
      correlationId: '123',
      metadata: { browser: 'Chrome', country: 'uk' },
    });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "correlation_id": "123",
        "message": "Hello message",
        "metadata": Object {
          "browser": "Chrome",
          "country": "uk",
        },
        "stack": undefined,
      }
    `);

    actual = transformer({
      error: new Error('Hello error'),
      correlationId: '123',
      metadata: { browser: 'Chrome', country: 'uk' },
    });

    expect(actual.correlation_id).toBe('123');
    expect(actual.message).toBe('Hello error');
    expect(actual.metadata).toEqual({
      browser: 'Chrome',
      country: 'uk',
    });
    expect(actual.stack!.length).toBeGreaterThan(0);
  });
});
