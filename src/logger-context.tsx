import * as React from 'react';
import { SplunkLogger } from './splunk-logger';
import { Logger } from './types';

interface LoggerProviderProps {
  applicationName: string;
  applicationVersion: string;
  loggerName: string;
  url: string;
  children: React.ReactNode;
}

const LoggerContext = React.createContext<Logger | undefined>(undefined);

function LoggerProvider({
  applicationName,
  applicationVersion,
  loggerName,
  url,
  children,
}: LoggerProviderProps) {
  const splunkLogger = new SplunkLogger({
    application_name: applicationName,
    application_version: applicationVersion,
    logger: loggerName,
    loggerUrl: url,
  });
  return (
    <LoggerContext.Provider value={splunkLogger}>
      {children}
    </LoggerContext.Provider>
  );
}

function useLogger() {
  const context = React.useContext(LoggerContext);
  if (typeof context === 'undefined') {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context;
}

export { LoggerProvider, useLogger };
