import * as React from 'react';
import { LoggerProvider } from '../common/logger-context';
import { makeSplunkFormatter } from './formatter';
import { SplunkMessageV1 } from './types';

interface SplunkLoggerProps {
  applicationName: string;
  applicationVersion: string;
  loggerName: string;
  onBeforeSend: (message: SplunkMessageV1) => void;
  children: React.ReactNode;
}

export function SplunkLogger({
  loggerName,
  applicationName,
  applicationVersion,
  onBeforeSend,
  children,
}: SplunkLoggerProps) {
  const logger = React.useRef(
    makeSplunkFormatter({
      loggerName,
      application_name: applicationName,
      application_version: applicationVersion,
      onBeforeSend,
    })
  );
  return <LoggerProvider logger={logger.current}>{children}</LoggerProvider>;
}
