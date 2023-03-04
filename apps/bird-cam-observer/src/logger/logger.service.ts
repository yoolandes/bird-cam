import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class LoggerService {

  private readonly customFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });


  private readonly logger = createLogger({
    transports: [
      new transports.File({
        filename: '../log.log',
        format: format.combine(format.timestamp(), this.customFormat),
      }),
      new transports.Console()
    ]
  });

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

}
