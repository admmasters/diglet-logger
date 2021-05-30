export type AcceptedMessageTypes =
  | string
  | {
      message: string;
      correlationId?: string;
      metadata?: Record<string, unknown>;
    }
  | Error
  | { error: Error; correlationId: string };

export type AppLogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error';

export interface CoreFields {
  application_name: string;
  application_version: string;
  logger: string;
}

export type Context = Record<string, any>;

type _LogTransformer = {
  [key in AppLogLevel]: (
    message: AcceptedMessageTypes,
    ...args: string[]
  ) => void;
};

export interface LogTransformer extends _LogTransformer {
  setContext: (context: Context) => void;
  clearContext: () => void;
}