import { LoggerService } from '@bird-cam/logger';
import { createRxJsQueue } from '@bird-cam/rxjs-queue';
import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
const { spawn } = require('node:child_process');

@Injectable()
export class SnapshotCaptureService {
  rxJsQueue = createRxJsQueue();
  constructor(private readonly loggerService: LoggerService) {}

  captureSnapshot(
    rtspUrl: string,
    username: string,
    password: string
  ): Observable<string> {
    return new Observable((source) => {
      this.loggerService.info('Capturing Snapshot...');
      const ffmpeg = spawn('ffmpeg', [
        '-rtsp_transport',
        'tcp',
        '-i',
        `rtsp://${username}:${password}@${rtspUrl}`,
        '-f',
        'image2',
        '-r',
        '1/10',
        '-update',
        '1',
        '-loglevel',
        'info',
        'pipe:',
      ]);
      let result = '';
      let frame = 0;
      ffmpeg.stdout.on('data', (data: Buffer) => {
        result += data.toString('base64');
      });

      ffmpeg.stderr.on('data', (err: Buffer) => {
        const exec = /frame=(\s*\d+)/.exec(err.toString());
        if (exec && exec.length) {
          const currentFrame = parseInt(exec[1]);
          if (currentFrame === frame && result) {
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
    }).pipe(this.rxJsQueue()) as Observable<string>;
  }

  getBrightness(
    rtspUrl: string,
    username: string,
    password: string
  ): Observable<number> {
    this.loggerService.info('Get Brightness...');
    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport',
      'tcp',
      '-i',
      `rtsp://${username}:${password}@${rtspUrl}`,
      '-f',
      'image2',
      '-vframes',
      '1',
      '-vf',
      'blackframe',
      '-loglevel',
      'info',
      'pipe:',
    ]);

    return from(
      new Promise<number>((resolve, reject) => {
        let result = 100;
        ffmpeg.stderr.on('data', (err: Buffer) => {
          const exec = /pblack:(\d+)/.exec(err.toString());
          if (exec && exec.length) {
            result = 100 - parseInt(exec[1], 10);
          }
        });

        ffmpeg.on('close', (code: number) => {
          this.loggerService.info('Brightness is: ' + result);
          return code === 0 ? resolve(result) : reject(code);
        });
      })
    ).pipe(this.rxJsQueue());
  }
}
