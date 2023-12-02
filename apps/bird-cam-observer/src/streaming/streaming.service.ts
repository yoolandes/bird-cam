import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { log } from 'console';

@Injectable()
export class StreamingService {
  private streamProcess: ChildProcess | undefined;

  constructor(private readonly loggerService: LoggerService) {}

  startStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.streamProcess) {
        return resolve();
      }

      this.streamProcess = spawn('v4l2rtspserver', [
        '-F10',
        '-W 640',
        '-H 480',
        '-P 8555',
        '/dev/video0',
      ]);

      this.streamProcess.stdout.on('data', (data: string) => {
        this.loggerService.log(`stdout: ${data}`);
      });

      this.streamProcess.stderr.on('data', (data: string) => {
        this.loggerService.log(`stderr: ${data}`);
        if (data.includes('Transport: RTP/AVP/UDP;')) {
          this.loggerService.log('resolved');
          resolve();
        }
      });
    });
  }

  stopStream(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.streamProcess) {
        return resolve();
      }
      this.streamProcess.on('close', (code, signal) => {
        resolve();
        this.loggerService.log(`child process exited with code ${signal}`);
        this.streamProcess = undefined;
      });
      this.streamProcess.kill('SIGKILL');
    });
  }
}
