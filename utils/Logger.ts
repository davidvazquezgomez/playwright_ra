import * as allure from 'allure-js-commons';

/**
 * Available log levels.
 * Verbosity order: DEBUG < INFO < WARN < ERROR
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

/**
 * Centralized logger for the test framework.
 *
 * - Writes to the console with a consistent format and timestamp.
 * - Optionally attaches each message as an Allure attachment.
 * - The level is controlled by the `LOG_LEVEL` environment variable
 *   (DEBUG | INFO | WARN | ERROR | SILENT). Default: INFO.
 *
 * Uso:
 * ```ts
 * import { Logger } from '../utils/Logger';
 *
 * const log = Logger.getInstance();
 * log.info('Navigating to the dashboard');
 * log.warn('Element not found, retrying...');
 * log.error('Failed to load the page', error);
 * log.debug('Selector used: #main-content');
 * ```
 */
export class Logger {
  private static instance: Logger;
  private level: LogLevel;

  private constructor() {
    const envLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
    this.level = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
  }

  /** Singleton — one shared instance for the entire execution */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /** Changes the log level at runtime */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  // ─── Public methods ─────────────────────────────────

  async debug(message: string, ...args: unknown[]): Promise<void> {
    await this.log(LogLevel.DEBUG, message, args);
  }

  async info(message: string, ...args: unknown[]): Promise<void> {
    await this.log(LogLevel.INFO, message, args);
  }

  async warn(message: string, ...args: unknown[]): Promise<void> {
    await this.log(LogLevel.WARN, message, args);
  }

  async error(message: string, ...args: unknown[]): Promise<void> {
    await this.log(LogLevel.ERROR, message, args);
  }

  /**
  * Attaches a message or step directly to Allure without checking the level.
  * Useful for ensuring important information is always included in the report.
   */
  async allureStep(name: string, body?: () => Promise<void>): Promise<void> {
    if (body) {
      await allure.step(name, body);
    } else {
      await allure.step(name, async () => { /* marker step */ });
    }
  }

  // ─── Internos ────────────────────────────────────────

  private async log(level: LogLevel, message: string, args: unknown[]): Promise<void> {
    if (level < this.level) return;

    const tag = LogLevel[level].padEnd(5);
    const timestamp = new Date().toISOString();
    const extra = args.length > 0 ? ' ' + args.map(a => (a instanceof Error ? a.message : String(a))).join(' ') : '';
    const formatted = `[${timestamp}] [${tag}] ${message}${extra}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }

    // Attach as an Allure step for WARN and ERROR levels
    if (level >= LogLevel.WARN) {
      try {
        await allure.step(`${tag}: ${message}${extra}`, async () => { /* log step */ });
      } catch {
        // Ignore when Allure is not available at this point
      }
    }
  }
}
