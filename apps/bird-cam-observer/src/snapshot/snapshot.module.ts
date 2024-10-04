import { Module } from '@nestjs/common';
import { LoggerModule } from '@bird-cam/logger';
import { HttpModule } from '@nestjs/axios';
import { SnapshotController } from './snapshot.controller';
import { SnapshotService } from './snapshot.service';

@Module({
  imports: [LoggerModule, HttpModule],
  controllers: [SnapshotController],
  providers: [SnapshotService],
})
export class SnapshotModule {}
