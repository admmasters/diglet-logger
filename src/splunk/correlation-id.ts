import { isPlainObject } from '../common/utils';
import { AcceptedMessageTypes } from '../common/types';

const getCorrelationId = (
  logMessage: AcceptedMessageTypes
): string | undefined => {
  if (isPlainObject(logMessage) && logMessage['correlationId']) {
    return logMessage['correlationId'];
  }
  return undefined;
};

export { getCorrelationId };
