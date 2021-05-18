import {
  DynamicMessage,
  LogMessage,
  MessageLevelFields,
  ZopaLogLevel,
} from '../types';
import { getMessage } from './message';
import { getCorrelationId } from './correlationId';
import { getStack } from './stack';
import { getMetadata } from './metadata';

const standardMessage = (level: ZopaLogLevel): MessageLevelFields => {
  return {
    level,
    time: new Date().toISOString(),
  };
};

const transformer = (
  logMessage: LogMessage,
  ...args: string[]
): DynamicMessage => {
  return {
    message: getMessage(logMessage, ...args),
    correlation_id: getCorrelationId(logMessage),
    stack: getStack(logMessage),
    metadata: getMetadata(logMessage),
  };
};

export { standardMessage, transformer };
