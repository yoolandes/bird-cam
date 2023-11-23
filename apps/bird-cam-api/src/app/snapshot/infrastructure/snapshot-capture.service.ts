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
  ): Promise<Uint8Array> {
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
      let result: Buffer;
      ffmpeg.stdout.on('data', (data: any) => {
        if (!result) {
          result = data;
        } else {
          result.join(data);
        }
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
