import { isPlainObject } from '../common/utils';
import { AcceptedMessageTypes } from '../common/types';

const getMessage = (
  logMessage: AcceptedMessageTypes,
  ...args: string[]
): string => {
  if (typeof logMessage === 'string' && args.length === 0) {
    return logMessage;
  }

  if (typeof logMessage === 'string' && args.length > 0) {
    return logMessage.concat(...args);
  }

  if (isPlainObject(logMessage) && logMessage['message']) {
    return logMessage['message'];
  }

  if (
    isPlainObject(logMessage) &&
    logMessage['error'] &&
    isPlainObject(logMessage['error'])
  ) {
    return logMessage['error'].message;
  }

  console.debug(`TODO: handle ${typeof logMessage}`);

  return '';
};

export { getMessage };
