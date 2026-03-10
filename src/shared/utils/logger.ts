// src/shared/utils/logger.ts
import env from '../../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: unknown;
}

const formatEntry = (level: LogLevel, message: string, context?: unknown): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  ...(context !== undefined && { context }),
});

const isDev = env.ENV === 'development';

const logger = {
  info: (message: string, context?: unknown): void => {
    if (isDev) console.info('[INFO]', formatEntry('info', message, context));
  },
  warn: (message: string, context?: unknown): void => {
    console.warn('[WARN]', formatEntry('warn', message, context));
  },
  error: (message: string, context?: unknown): void => {
    console.error('[ERROR]', formatEntry('error', message, context));
  },
  debug: (message: string, context?: unknown): void => {
    if (isDev) console.debug('[DEBUG]', formatEntry('debug', message, context));
  },
};

export default logger;
