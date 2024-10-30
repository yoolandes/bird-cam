import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/comment.module';
import { JanusEventsModule } from './janus-events/janus-events.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MotionDetectionModule } from './motion-detection/motion-detection.module';
import { BrightnessModule } from './brightness/brightness.module';
import { ActiveViewersModule } from './active-viewers/active-viewers.module';
import { PushSubscriptionModule } from './push-subscription/push-subscription.module';
import { MotionActivityModule } from './motion-activity/motion-activity.module';
import { HealthPingModule } from './health-ping/health-ping.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TimelapseModule } from './timelapse/timelapse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: 3306,
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    SnapshotModule,
    CommentModule,
    JanusEventsModule,
    MotionDetectionModule,
    BrightnessModule,
    ActiveViewersModule,
    PushSubscriptionModule,
    MotionActivityModule,
    HealthPingModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: configService.getOrThrow<string>('SNAPSHOT_PATH'),
          serveRoot: '/snapshot',
        },
      ],
      inject: [ConfigService],
    }),
    TimelapseModule,
  ],
})
export class AppModule {}
