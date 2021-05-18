import { isPlainObject } from '../utils';
import { LogMessage } from '../types';

const getCorrelationId = (logMessage: LogMessage): string | undefined => {
  if (isPlainObject(logMessage) && logMessage['correlationId']) {
    return logMessage['correlationId'];
  }
  return undefined;
};

export { getCorrelationId };
