import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LedModule } from '../led/led.module';
import { LoggerModule } from '@bird-cam/logger';
import { MailerModule } from '../mailer/mailer.module';
import { MotionDetectorModule } from '../motion-detector/motion-detector.module';

import { AppService } from './app.service';
import { StreamingModule } from '../streaming/streaming.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    HttpModule,
    LedModule,
    MailerModule,
    MotionDetectorModule,
    LoggerModule,
    StreamingModule,
    SnapshotModule,
  ],
  providers: [AppService],
})
export class AppModule {}
