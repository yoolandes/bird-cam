import { Injectable } from '@nestjs/common';
import { SnapshotService } from '../snapshot/application/snapshot.service';
import { ConfigService } from '@nestjs/config';
import * as schedule from 'node-schedule';
import { LoggerService } from '@bird-cam/logger';
import { SnapshotCause } from '@bird-cam/snapshot/model';
import * as fs from 'fs';
import { join } from 'path';
import { createReadStream } from 'fs';
const { spawn } = require('node:child_process');

@Injectable()
export class TimelapseService {
  readonly snapshotPath: string;
  constructor(private readonly configService: ConfigService) {
    this.snapshotPath = this.configService.getOrThrow<string>('SNAPSHOT_PATH');
  }

  getTimelapse(): fs.ReadStream {
    return createReadStream(join(this.snapshotPath + 'timelapse.mp4'));
  }
}
