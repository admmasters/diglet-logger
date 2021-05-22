import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { LoggerProvider, useLogger } from '../logger-context';
import { AcceptedMessageTypes, AppLogLevel, LogTransformer } from '../types';

const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00.000Z';

beforeEach(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
});

afterAll(() => {
  jest.useRealTimers();
});

const makeLogger =
  (logger: LogTransformer, level: AppLogLevel) =>
  (message: AcceptedMessageTypes, ...args: string[]) => {
    const wrapper: React.FC<any> = ({ children }) => (
      <LoggerProvider logger={logger}>{children}</LoggerProvider>
    );
    const { result } = renderHook(() => useLogger(), { wrapper });

    act(() => {
      result.current[level](message, ...args);
    });
  };

describe('logger-context', () => {
  test.each([
    ['debug', 'Hello world'] as const,
    ['log', 'Hello world'] as const,
    ['warn', 'Hello world'] as const,
    ['error', 'Hello world'] as const,
  ])('Test sending messages at %s log level', (level, message: string) => {
    const fakeLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const logger = makeLogger(fakeLogger, level);
    logger(message);
    expect(fakeLogger[level]).toBeCalledTimes(1);
    expect(fakeLogger[level].mock.calls).toEqual([['Hello world']]);
  });
});
