import { Injectable } from '@nestjs/common';
import { SnapshotService } from '../snapshot/application/snapshot.service';
import { ConfigService } from '@nestjs/config';
import * as schedule from 'node-schedule';
import { LoggerService } from '@bird-cam/logger';
import { SnapshotCause } from '@bird-cam/snapshot/model';
import * as fs from 'fs';
import { join } from 'path';

const { spawn } = require('node:child_process');

@Injectable()
export class TimelapseCreatorService {
  readonly timelapseCreationSchedule: string;
  readonly snapshotPath: string;
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    this.snapshotPath = this.configService.getOrThrow<string>('SNAPSHOT_PATH');
    this.timelapseCreationSchedule = this.configService.getOrThrow<string>(
      'TIMELAPSE_CREATION_SCHEDULE'
    );
    this.scheduleTimelapseCreation(this.timelapseCreationSchedule);
    this.createTimelapse();
  }

  private scheduleTimelapseCreation(cronSpec: string): void {
    const job = schedule.scheduleJob(cronSpec, async () => {
      this.createTimelapse();
    });

    if (job) {
      this.loggerService.log(
        'Next timelapse creation job will run on: ' + job.nextInvocation()
      );
    } else {
      this.loggerService.error(
        'Timelapse creation job will not run with "TIMELAPSE_CREATION_SCHEDULE"=' +
          cronSpec +
          '. Please provide a valid cron specification.'
      );
    }
  }

  private createTimelapse(): any {
    this.loggerService.log('Creating timelapse...');
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    this.snapshotService
      .findAll({
        path: '',
        filter: {
          date: '$gt:' + yesterday.toISOString(),
          snapshotCause: '$eq:' + SnapshotCause.Interval,
        },
        select: ['id', 'filePath'],
        limit: 500,
      })
      .then((paginatedSnapshots) => {
        const content = paginatedSnapshots.data.map(({ filePath }) => {
          const name = filePath.split('/').pop();
          return "file '" + name + "'\n";
        });
        return fs.promises.writeFile(
          join(this.snapshotPath, 'files.txt'),
          content
        );
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          const ffmpeg = spawn('ffmpeg', [
            '-f',
            'concat',
            '-i',
            this.snapshotPath + 'files.txt',
            '-s:v',
            '1920x1080',
            '-c:v',
            'libx264',
            '-b:v',
            '3M',
            '-maxrate',
            '5M',
            '-bufsize',
            '2M',
            '-pix_fmt',
            'yuv420p',
            '-y',
            this.snapshotPath + 'timelapse.mp4',
          ]);
          ffmpeg.on('close', (code: number) => {
            console.log(code);
            code === 0 ? resolve(void 0) : reject();
          });
        });
      })
      .then(() => {
        this.loggerService.log('Timelapse created succesfully!');
      })
      .catch((err) => {
        this.loggerService.error('Timelapse created failure!');
      });
  }
}
