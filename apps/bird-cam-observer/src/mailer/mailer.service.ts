import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { LoggerService } from '@bird-cam/logger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly transport = nodemailer.createTransport({
    host: this.configService.getOrThrow('EMAIL_HOST'),
    port: this.configService.getOrThrow('EMAIL_PORT'),
    auth: {
      user: this.configService.getOrThrow('EMAIL_USER'),
      pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
    },
  });

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {}

  sendMail(): void {
    this.transport.sendMail(this.mailOptions(), (error, _) => {
      if (error) {
        this.loggerService.error(error.message);
      }
    });
  }

  private mailOptions(): Mail.Options {
    return {
      from: this.configService.getOrThrow('EMAIL_USER'),
      to: this.configService.getOrThrow('EMAIL_RECIPIENT'),
      subject: 'Birdcam Motion Warning',
      text: new Date().toString(),
    };
  }
}
