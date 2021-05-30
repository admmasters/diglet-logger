import { makeSplunkFormatter } from '../formatter';
import { AppLogLevel } from '../../common/types';

const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00.000Z';

const getMessageObject = (...level: AppLogLevel[]) =>
  level.map((l) => [l, { message: 'Hello World' }] as const);

const getMessageWithCorrelationId = (...level: AppLogLevel[]) =>
  level.map(
    (l) =>
      [l, { message: 'Hello World', correlationId: '123-123-123' }] as const
  );

const getMessageWithMetadata = (...level: AppLogLevel[]) =>
  level.map(
    (l) =>
      [l, { message: 'Hello World', metadata: { browser: 'chrome' } }] as const
  );

const getError = (...level: AppLogLevel[]) =>
  level.map((l) => [l, new Error('Hello Error')] as const);

describe('splunk-formatter', () => {
  const transformedCallback = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });

  afterEach(() => {
    transformedCallback.mockClear();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.each([
    ['debug', 'DEBUG'] as const,
    ['info', 'INFO'] as const,
    ['log', 'INFO'] as const,
    ['warn', 'WARN'] as const,
    ['error', 'ERROR'] as const,
  ])('log[%s] should transform to %s level', (level, outputLevel) => {
    const logger = makeSplunkFormatter({
      application_name: 'SuperApplication',
      loggerName: 'SuperLogger',
      application_version: '1.0',
      onBeforeSend: transformedCallback,
    });

    logger[level]('Hello World');

    const [transformed] = transformedCallback.mock.calls[0];

    expect(transformed.level).toBe(outputLevel);
  });

  it.each([
    ['debug', 'Hello World'] as const,
    ['info', 'Hello World'] as const,
    ['log', 'Hello World'] as const,
    ['warn', 'Hello World'] as const,
    ['error', 'Hello World'] as const,
  ])(
    'log[%s] should transform a simple string message: %s',
    (level, message) => {
      const logger = makeSplunkFormatter({
        application_name: 'SuperApplication',
        loggerName: 'SuperLogger',
        application_version: '1.0',
        onBeforeSend: transformedCallback,
      });

      logger[level](message);

      const [transformed] = transformedCallback.mock.calls[0];
      expect(transformed.message).toBe(message);
    }
  );

  it.each(getMessageObject('debug', 'info', 'log', 'warn', 'error'))(
    'log[%s] should transform an object with a message property: %s',
    (level, messageObject) => {
      const logger = makeSplunkFormatter({
        application_name: 'SuperApplication',
        loggerName: 'SuperLogger',
        application_version: '1.0',
        onBeforeSend: transformedCallback,
      });

      logger[level](messageObject);

      const [transformed] = transformedCallback.mock.calls[0];
      expect(transformed.message).toBe(messageObject.message);
    }
  );

  it.each(getMessageWithCorrelationId('debug', 'info', 'log', 'warn', 'error'))(
    'log[%s] should transform an object with a correlationId property: %s',
    (level, messageObject) => {
      const logger = makeSplunkFormatter({
        application_name: 'SuperApplication',
        loggerName: 'SuperLogger',
        application_version: '1.0',
        onBeforeSend: transformedCallback,
      });

      logger[level](messageObject);

      const [transformed] = transformedCallback.mock.calls[0];
      expect(transformed.message).toBe(messageObject.message);
    }
  );

  it.each(getMessageWithMetadata('debug', 'info', 'log', 'warn', 'error'))(
    'log[%s] should transform an object with metadata: %s',
    (level, messageObject) => {
      const logger = makeSplunkFormatter({
        application_name: 'SuperApplication',
        loggerName: 'SuperLogger',
        application_version: '1.0',
        onBeforeSend: transformedCallback,
      });

      logger[level](messageObject);

      const [transformed] = transformedCallback.mock.calls[0];
      expect(transformed.metadata).toBe(messageObject.metadata);
    }
  );

  it.each(getError('debug', 'info', 'log', 'warn', 'error'))(
    'log[%s] should transform an error: %s',
    (level, messageObject) => {
      const logger = makeSplunkFormatter({
        application_name: 'SuperApplication',
        loggerName: 'SuperLogger',
        application_version: '1.0',
        onBeforeSend: transformedCallback,
      });

      logger[level](messageObject);

      const [transformed] = transformedCallback.mock.calls[0];
      expect(transformed.message).toBe(messageObject.message);

      // Don't assert on the stack message as this is brittle
      expect(transformed.stack.length).toBeGreaterThan(1);
    }
  );

  it('Check all fields are as expected', () => {
    const logger = makeSplunkFormatter({
      application_name: 'SuperApplication',
      loggerName: 'SuperLogger',
      application_version: '1.0',
      onBeforeSend: transformedCallback,
    });

    logger.log('Hello World');

    const [transformed] = transformedCallback.mock.calls[0];

    expect(transformedCallback).toBeCalledTimes(1);
    expect(transformed.message).toEqual('Hello World');
    expect(transformed.logger).toEqual('SuperLogger');
    expect(transformed.application_version).toEqual('1.0');
    expect(transformed.application_name).toEqual('SuperApplication');
    expect(transformed.level).toEqual('INFO');
    expect(transformed.time).toEqual(FIXED_SYSTEM_TIME);
    expect(transformed.correlation_id).toBeUndefined();
    expect(transformed.stack).toBeUndefined();
    expect(transformed.metadata).toBeUndefined();
  });

  it('Check all fields are as expected', () => {
    const logger = makeSplunkFormatter({
      application_name: 'SuperApplication',
      loggerName: 'SuperLogger',
      application_version: '1.0',
      onBeforeSend: transformedCallback,
    });

    logger.error({ correlationId: '123', error: new Error('Hello World') });

    const [transformed] = transformedCallback.mock.calls[0];

    expect(transformedCallback).toBeCalledTimes(1);
    expect(transformed.message).toEqual('Hello World');
    expect(transformed.logger).toEqual('SuperLogger');
    expect(transformed.application_version).toEqual('1.0');
    expect(transformed.application_name).toEqual('SuperApplication');
    expect(transformed.level).toEqual('ERROR');
    expect(transformed.time).toEqual(FIXED_SYSTEM_TIME);
    expect(transformed.correlation_id).toEqual('123');
    expect(transformed.stack.length).toBeGreaterThan(0);
    expect(transformed.metadata).toBeUndefined();
  });

  it('Should be able to set context', () => {
    const logger = makeSplunkFormatter({
      application_name: 'SuperApplication',
      loggerName: 'SuperLogger',
      application_version: '1.0',
      onBeforeSend: transformedCallback,
    });

    logger.setContext({ 'applicationId': '123456789'});

    logger.log('Hello!');

    let [transformed] = transformedCallback.mock.calls[0];
    expect(transformed.metadata).toEqual({ 'applicationId': '123456789' });
    expect(transformed.message).toEqual("Hello!");


    logger.clearContext();

    logger.log('Hello!');

    [transformed] = transformedCallback.mock.calls[1];

    expect(transformed.metadata).toEqual({});
    expect(transformed.message).toEqual("Hello!");


  });
});
