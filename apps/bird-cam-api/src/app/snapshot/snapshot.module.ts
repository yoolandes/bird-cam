import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotController } from './infrastructure/snapshot.controller';
import multer from 'multer';

import { SnapshotService } from './application/snapshot.service';
import { Snapshot } from './infrastructure/model/snapshot.entity';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { SnapshotCaptureService } from './infrastructure/snapshot-capture.service';
import { LoggerModule } from '@bird-cam/logger';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './dist/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueSuffix +
        '.' +
        file.mimetype.substring(file.mimetype.indexOf('/') + 1)
    );
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Snapshot]),
    MulterModule.register({
      storage,
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
    JanusEventsModule,
    LoggerModule,
  ],
  controllers: [SnapshotController],
  providers: [SnapshotService, SnapshotCaptureService],
  exports: [SnapshotService, SnapshotCaptureService],
})
export class SnapshotModule {}
