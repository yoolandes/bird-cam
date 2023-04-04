import { Module } from '@nestjs/common';
import { LoggerModule } from '@bird-cam/logger';

import { MailerService } from './mailer.service';

@Module({
  imports: [LoggerModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule { }
