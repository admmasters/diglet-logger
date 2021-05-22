import { getMessage } from './message';
import { getCorrelationId } from './correlation-id';
import { getStack } from './stack';
import { getMetadata } from './metadata';
import { SplunkLogLevel, SplunkMessageV1 } from './types';
import { AcceptedMessageTypes } from '../common/types';

const coreTransformer = (
  level: SplunkLogLevel
): Pick<SplunkMessageV1, 'level' | 'time'> => {
  return {
    level,
    time: new Date().toISOString(),
  };
};

const transformer = (
  logMessage: AcceptedMessageTypes,
  ...args: string[]
): Pick<
  SplunkMessageV1,
  'message' | 'correlation_id' | 'stack' | 'metadata'
> => {
  return {
    message: getMessage(logMessage, ...args),
    correlation_id: getCorrelationId(logMessage),
    stack: getStack(logMessage),
    metadata: getMetadata(logMessage),
  };
};

export { coreTransformer, transformer };
