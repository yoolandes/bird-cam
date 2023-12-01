import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
const { spawn } = require('node:child_process');

@Injectable()
export class SnapshotCaptureService {
  constructor(private readonly loggerService: LoggerService) {}

  captureSnapshot(
    rtspUrl: string,
    username: string,
    password: string
  ): Promise<string> {
    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport',
      'tcp',
      '-i',
      `rtsp://${username}:${password}@${rtspUrl}`,
      '-f',
      'image2',
      '-vframes',
      '1',
      '-loglevel',
      'error',
      'snapshot.jpg',
    ]);

    return new Promise((resolve, reject) => {
      let result = '';
      ffmpeg.stdout.on('data', (data: Buffer) => {
        result += data.toString('base64');
      });

      ffmpeg.stderr.on('data', (err: string) => {
        this.loggerService.error(err);
      });

      ffmpeg.on('close', (code: number) => {
        code === 0 ? resolve(result) : reject(code);
      });
    });
  }

  getBrightness(
    rtspUrl: string,
    username: string,
    password: string
  ): Promise<number> {
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
      'blackframe=80',
      '-loglevel',
      'info',
      'pipe:',
    ]);

    return new Promise((resolve, reject) => {
      let result = 0;
      ffmpeg.stderr.on('data', (err: Buffer) => {
        const exec = /pblack:(\d+)/.exec(err.toString());
        if (exec && exec.length && !result) {
          result = 100 - parseInt(exec[1], 10);
        }
      });

      ffmpeg.on('close', (code: number) => {
        this.loggerService.info('Brightness is: ' + result);
        return code === 0 ? resolve(result) : reject(code);
      });
    });
  }
}
