import * as React from 'react';
import { LogTransformer } from './types';

interface LoggerProviderProps {
  logger: LogTransformer;
  children: React.ReactNode;
}

const LoggerContext =
  React.createContext<LogTransformer | undefined>(undefined);

function LoggerProvider({ logger, children }: LoggerProviderProps) {
  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
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
