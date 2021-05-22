export type SplunkLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface SplunkMessageV1 {
  application_name: string;
  application_version: string;
  logger: string;
  message: string;
  correlation_id?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
  time: string;
  level: SplunkLogLevel;
}
