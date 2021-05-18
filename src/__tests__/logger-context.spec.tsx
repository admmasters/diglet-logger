import { act, renderHook } from '@testing-library/react-hooks';
import { LoggerProvider, useLogger } from '../logger-context';
import axios from 'axios';
import { AppLogLevel, LogMessage, ZopaLogLevel } from '../types';
import * as React from 'react';

const mockHttpClient = axios as jest.Mocked<typeof axios>;
const FAKE_LOGGING_ENDPOINT = 'http://logger.com/api/logs';
const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00.000Z';
const FAKE_APP_NAME = 'SuperApplication';
const FAKE_LOGGER_NAME = 'WebLogger';
const FAKE_APP_VERSION = '1.0';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

beforeEach(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
});

afterEach(() => {
  mockHttpClient.post.mockClear();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('logger-context', () => {
  test.each([
    ['debug', 'DEBUG', 'Hello world'] as const,
    ['log', 'INFO', 'Hello world'] as const,
    ['warn', 'WARN', 'Hello world'] as const,
    ['error', 'ERROR', 'Hello world'] as const,
  ])(
    'Test %s log level',
    (level, zopaLogLevel: ZopaLogLevel, message: string) => {
      const logger = testLog(level);
      logger(message);
      expect(mockHttpClient.post).toBeCalledTimes(1);
      expect(mockHttpClient.post.mock.calls).toEqual([
        [
          FAKE_LOGGING_ENDPOINT,
          [
            {
              application_name: FAKE_APP_NAME,
              application_version: FAKE_APP_VERSION,
              logger: FAKE_LOGGER_NAME,
              time: FIXED_SYSTEM_TIME,
              level: zopaLogLevel,
              message: message,
              metadata: undefined,
              correlation_id: undefined,
              stack: undefined,
            },
          ],
        ],
      ]);
    }
  );

  test.each([
    [
      'debug',
      'DEBUG',
      { message: 'Hello world', correlationId: 'correlation-id' },
    ] as const,
    [
      'log',
      'INFO',
      { message: 'Hello world', correlationId: 'correlation-id' },
    ] as const,
    [
      'warn',
      'WARN',
      { message: 'Hello world', correlationId: 'correlation-id' },
    ] as const,
    [
      'error',
      'ERROR',
      { message: 'Hello world', correlationId: 'correlation-id' },
    ] as const,
  ])(
    'Test %s log level with a correlationId',
    (
      level,
      zopaLogLevel,
      message: { message: string; correlationId: string }
    ) => {
      const logger = testLog(level);
      logger(message);
      expect(mockHttpClient.post).toBeCalledTimes(1);
      expect(mockHttpClient.post.mock.calls).toEqual([
        [
          FAKE_LOGGING_ENDPOINT,
          [
            {
              application_name: FAKE_APP_NAME,
              application_version: FAKE_APP_VERSION,
              logger: FAKE_LOGGER_NAME,
              time: FIXED_SYSTEM_TIME,
              correlation_id: message.correlationId,
              level: zopaLogLevel,
              message: message.message,
              metadata: undefined,
              stack: undefined,
            },
          ],
        ],
      ]);
    }
  );

  test('Transform an error', () => {
    const logger = testLog('error');
    logger(new Error('Hello Error'));

    const [urlArg, logBodyArray] = mockHttpClient.post.mock.calls[0];
    const [logBodyArg] = logBodyArray;

    expect(mockHttpClient.post).toBeCalledTimes(1);
    // passed the right base url
    expect(urlArg).toEqual(FAKE_LOGGING_ENDPOINT);
    expect(logBodyArg.message).toEqual('Hello Error');
    expect(logBodyArg.application_name).toEqual(FAKE_APP_NAME);
    expect(logBodyArg.application_version).toEqual(FAKE_APP_VERSION);
    expect(logBodyArg.correlation_id).toBeUndefined();
    expect(logBodyArg.level).toBe('ERROR');
    expect(logBodyArg.logger).toBe(FAKE_LOGGER_NAME);
    expect(logBodyArg.metadata).toBeUndefined();

    // We don't want to assert the exact content in the stack - just that it exists and has a length over 0
    expect(logBodyArg.stack.length).toBeGreaterThan(0);
  });

  test('Test multiple strings', () => {
    const logger = testLog('log');
    logger('Hello', 'World');

    const [_, logBodyArray] = mockHttpClient.post.mock.calls[0];
    const [logBodyArg] = logBodyArray;

    expect(logBodyArg.message).toEqual('HelloWorld');
  });

  const testLog =
    (level: AppLogLevel) =>
    (message: LogMessage, ...args: string[]) => {
      const wrapper: React.FC<any> = ({ children }) => (
        <LoggerProvider
          loggerName={FAKE_LOGGER_NAME}
          applicationName={FAKE_APP_NAME}
          applicationVersion={FAKE_APP_VERSION}
          url={FAKE_LOGGING_ENDPOINT}
        >
          {children}
        </LoggerProvider>
      );
      const { result } = renderHook(() => useLogger(), { wrapper });

      act(() => {
        result.current[level](message, ...args);
      });
    };
});
