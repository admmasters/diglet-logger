import { isPlainObject } from '../utils';
import { LogMessage } from '../types';

const getMessage = (logMessage: LogMessage, ...args: string[]): string => {
  if (typeof logMessage === 'string' && args.length === 0) {
    return logMessage;
  }

  if (typeof logMessage === 'string' && args.length > 0) {
    return logMessage.concat(...args);
  }

  if (isPlainObject(logMessage) && logMessage['message']) {
    return logMessage['message'];
  }

  console.debug(`TODO: handle ${typeof logMessage}`);

  return '';
};

export { getMessage };
