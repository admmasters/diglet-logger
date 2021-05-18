export type LogMessage =
  | string
  | {
      message: string;
      correlationId?: string;
      metadata?: Record<string, unknown>;
    }
  | Error;

export type ZopaLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type AppLogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error';

export type Transformer = (
  logMessage: LogMessage,
  ...args: string[]
) => DynamicMessage;

export interface ZopaMessage
  extends DynamicMessage,
    CoreFields,
    MessageLevelFields {}

export interface DynamicMessage {
  message: string;
  correlation_id?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export interface CoreFields {
  application_name: string;
  application_version: string;
  logger: string;
}

export interface MessageLevelFields {
  time: string;
  level: ZopaLogLevel;
}

export type Logger = {
  [key in AppLogLevel]: (message: LogMessage, ...args: string[]) => void;
};
