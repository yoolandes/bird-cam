import { Injectable, LoggerService as Logger } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements Logger {
  private readonly customFormat = format.printf(
    ({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    }
  );

  private readonly logger = createLogger({
    transports: [
      new transports.DailyRotateFile({
        filename: 'birdcam-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '7d',
        format: format.combine(format.timestamp(), this.customFormat),
      }),
      new transports.Console(),
    ],
  });

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  log(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }
}
