import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotController } from './snapshot.controller';
import { Snapshot } from './snapshot.entity';
import multer from 'multer';

import { SnapshotService } from './snapshot.service';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' +  file.mimetype.substring(file.mimetype.indexOf('/') + 1));
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Snapshot]),
    MulterModule.register({
      storage,
      dest: './dist/uploads',
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  ],
  controllers: [SnapshotController],
  providers: [SnapshotService],
})
export class SnapshotModule {}
