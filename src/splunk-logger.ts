import axios from 'axios';
import {
  CoreFields,
  ZopaLogLevel,
  Transformer,
  Logger,
  LogMessage,
} from './types';
import { standardMessage, transformer } from './transformers/transformer';

interface SplunkLoggerConstructor {
  loggerUrl: string;
  application_name: string;
  application_version: string;
  logger: string;
}

export class SplunkLogger implements Logger {
  readonly transformer: Transformer;
  readonly loggerUrl: string;
  readonly coreFields: CoreFields;

  constructor({
    application_name,
    application_version,
    loggerUrl,
    logger,
  }: SplunkLoggerConstructor) {
    if (!loggerUrl) {
      throw new Error('missing baseURL');
    }
    this.loggerUrl = loggerUrl;
    this.transformer = transformer;
    this.coreFields = {
      logger,
      application_version,
      application_name,
    };
  }

  log(logMessage: LogMessage, ...args: string[]) {
    this.logMessageAtLevel('INFO')(logMessage, ...args);
  }

  debug(logMessage: LogMessage, ...args: string[]) {
    this.logMessageAtLevel('DEBUG')(logMessage, ...args);
  }

  error(logMessage: LogMessage, ...args: string[]) {
    this.logMessageAtLevel('ERROR')(logMessage, ...args);
  }

  info(logMessage: LogMessage, ...args: string[]) {
    this.logMessageAtLevel('INFO')(logMessage, ...args);
  }

  warn(logMessage: LogMessage, ...args: string[]) {
    this.logMessageAtLevel('WARN')(logMessage, ...args);
  }

  logMessageAtLevel =
    (level: ZopaLogLevel) =>
    (logMessage: LogMessage, ...args: string[]) => {
      const payload = this.transformer(logMessage, ...args);
      const standardFields = standardMessage(level);
      axios.post(`${this.loggerUrl}`, [
        { ...payload, ...this.coreFields, ...standardFields },
      ]);
    };
}
