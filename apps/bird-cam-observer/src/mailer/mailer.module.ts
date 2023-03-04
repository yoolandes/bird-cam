import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';

import { MailerService } from './mailer.service';

@Module({
  imports: [LoggerModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule { }
