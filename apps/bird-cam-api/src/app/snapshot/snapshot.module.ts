import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotController } from './snapshot.controller';
import { Snapshot } from './snapshot.entity';

import { SnapshotService } from './snapshot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Snapshot]),
    MulterModule.register({
      dest: './dist/uploads',
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),],
  controllers: [SnapshotController],
  providers: [SnapshotService],
})
export class SnapshotModule { }
