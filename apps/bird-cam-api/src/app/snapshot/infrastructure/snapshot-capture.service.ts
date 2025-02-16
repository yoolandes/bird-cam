import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { finalize, Observable } from 'rxjs';

const { spawn } = require('node:child_process');

@Injectable()
export class SnapshotCaptureService {
  constructor(private readonly loggerService: LoggerService) {}

  captureSnapshot(
    rtspUrl: string,
    username: string,
    password: string
  ): Observable<string> {
    return new Observable((source) => {
      this.loggerService.info('Capturing Snapshot with FFMPEG...');
      const ffmpeg = spawn('ffmpeg', [
        '-rtsp_transport',
        'tcp',
        '-i',
        `rtsp://${rtspUrl}`,
        '-update',
        '1',
        '-loglevel',
        'info',
        '-f',
        'image2',
        'pipe:',
      ]);
      let result = '';
      let frame = 0;
      ffmpeg.stdout.on('data', (data: Buffer) => {
        this.loggerService.log('got real data');
        result += data.toString('base64');
      });

      ffmpeg.stderr.on('data', (err: Buffer) => {
        this.loggerService.log('FFMPEG data');
        const exec = /frame=(\s*\d+)/.exec(err.toString());
        if (exec && exec.length) {
          const currentFrame = parseInt(exec[1]);
          if (currentFrame !== frame && result) {
            source.next(result);
            result = '';
          }
          frame = currentFrame;
        }
      });

      ffmpeg.on('close', (code: number) => {
        code === 0 ? source.complete() : source.error(code);
      });

      source.add(() => {
        ffmpeg.kill('SIGKILL');
      });
    }).pipe(
      finalize(() => this.loggerService.log('completed with ffmpeg'))
    ) as Observable<string>;
  }
}
