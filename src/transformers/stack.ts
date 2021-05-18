import { isPlainObject } from '../utils';
import { LogMessage } from '../types';

const getStack = (logMessage: LogMessage) => {
  if (isPlainObject(logMessage) && logMessage.stack) {
    return logMessage.stack;
  }

  if (logMessage instanceof Error) {
    return logMessage.stack;
  }

  return;
};

export { getStack };
