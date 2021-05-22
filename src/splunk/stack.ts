import { isPlainObject } from '../common/utils';
import { AcceptedMessageTypes } from '../common/types';

const getStack = (logMessage: AcceptedMessageTypes) => {
  if (isPlainObject(logMessage) && logMessage.stack) {
    return logMessage.stack;
  }

  if (logMessage instanceof Error) {
    return logMessage.stack;
  }

  if (isPlainObject(logMessage) && isPlainObject(logMessage['error'])) {
    return logMessage.error.stack;
  }

  return;
};

export { getStack };
