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
      'pipe:',
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
}
