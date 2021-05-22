import { AcceptedMessageTypes, CoreFields } from '../common/types';
import { coreTransformer, transformer } from './transformer';
import { SplunkLogLevel, SplunkMessageV1 } from './types';
import { LogTransformer } from '../common/types';

interface SplunkLoggerConstructor {
  application_name: string;
  application_version: string;
  loggerName: string;
  onBeforeSend: (message: SplunkMessageV1) => void;
}

class SplunkFormatter implements LogTransformer {
  readonly coreFields: CoreFields;
  readonly onBeforeSend: (message: SplunkMessageV1) => void;

  constructor({
    application_name,
    application_version,
    loggerName,
    onBeforeSend,
  }: SplunkLoggerConstructor) {
    this.coreFields = {
      logger: loggerName,
      application_version,
      application_name,
    };
    this.onBeforeSend = onBeforeSend;
  }

  log(logMessage: AcceptedMessageTypes, ...args: string[]) {
    this.transformMessageForLevel('INFO')(logMessage, ...args);
  }

  debug(logMessage: AcceptedMessageTypes, ...args: string[]) {
    this.transformMessageForLevel('DEBUG')(logMessage, ...args);
  }

  error(logMessage: AcceptedMessageTypes, ...args: string[]) {
    this.transformMessageForLevel('ERROR')(logMessage, ...args);
  }

  info(logMessage: AcceptedMessageTypes, ...args: string[]) {
    this.transformMessageForLevel('INFO')(logMessage, ...args);
  }

  warn(logMessage: AcceptedMessageTypes, ...args: string[]) {
    this.transformMessageForLevel('WARN')(logMessage, ...args);
  }

  transformMessageForLevel =
    (level: SplunkLogLevel) =>
    (logMessage: AcceptedMessageTypes, ...args: string[]) => {
      const payload = transformer(logMessage, ...args);
      const standardFields = coreTransformer(level);
      this.onBeforeSend({ ...payload, ...this.coreFields, ...standardFields });
    };
}

export function makeSplunkFormatter(
  args: SplunkLoggerConstructor
): LogTransformer {
  return new SplunkFormatter(args);
}
