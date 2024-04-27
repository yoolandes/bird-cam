import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { defer, finalize, Observable } from 'rxjs';

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
    }).pipe(
      finalize(() => this.loggerService.log('completed with ffmpeg')),
      customOperator((n) => this.loggerService.log('Count updated: ' + n))
    ) as Observable<string>;
  }
}

function customOperator(onCountUpdate = noop) {
  return function refCountOperatorFunction(source$) {
    let counter = 0;

    return defer(() => {
      counter++;
      onCountUpdate(counter);
      return source$;
    }).pipe(
      finalize(() => {
        counter--;
        onCountUpdate(counter);
      })
    );
  };
}

function noop(c) {
  return c;
}
