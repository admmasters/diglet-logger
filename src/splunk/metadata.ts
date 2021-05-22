import { isPlainObject } from '../common/utils';
import { AcceptedMessageTypes } from '../common/types';

const getMetadata = (
  logMessage: AcceptedMessageTypes
): Record<string, unknown> | undefined => {
  if (isPlainObject(logMessage) && isPlainObject(logMessage.metadata)) {
    return logMessage.metadata;
  }

  return undefined;
};

export { getMetadata };
