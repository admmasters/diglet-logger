import { isPlainObject } from '../utils';
import { LogMessage } from '../types';

const getMetadata = (
  logMessage: LogMessage
): Record<string, unknown> | undefined => {
  if (isPlainObject(logMessage) && isPlainObject(logMessage.metadata)) {
    return logMessage.metadata;
  }

  return undefined;
};

export { getMetadata };
