import { Module } from '@nestjs/common';
import { TimelapseController } from './timelapse.controller';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { ConfigModule } from '@nestjs/config';
import { TimelapseCreatorService } from './timelapse-creator.service';
import { LoggerModule } from '@bird-cam/logger';
import { TimelapseService } from './timelapse.service';

@Module({
  controllers: [TimelapseController],
  providers: [TimelapseCreatorService, TimelapseService],
  imports: [SnapshotModule, ConfigModule, LoggerModule],
})
export class TimelapseModule {
  constructor(
    private readonly timelapseCreatorService: TimelapseCreatorService
  ) {}
}
