import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { ChildProcess, exec, spawn } from 'child_process';

@Injectable()
export class StreamingService {
  private streamProcess: ChildProcess | undefined;

  private readonly command =
    'v4l2rtspserver -F10 -W 1920 -H 1080 -P 8555 /dev/video0';

  constructor(private readonly loggerService: LoggerService) {}

  startStream(): void {
    if (this.streamProcess) {
      return;
    }
    this.streamProcess = spawn('v4l2rtspserver', [
      '-F10',
      '-W 1920',
      '-H 1080',
      '-P 8555',
      '/dev/video0',
    ]);

    this.streamProcess.stdout.on('data', (data) => {
      this.loggerService.log(`stdout: ${data}`);
    });

    this.streamProcess.stderr.on('data', (data) => {
      this.loggerService.error(`stderr: ${data}`);
    });
  }

  stopStream(): Promise<void> {
    if (!this.streamProcess) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.streamProcess.on('close', (code) => {
        resolve();
        this.loggerService.log(`child process exited with code ${code}`);
        this.streamProcess = undefined;
      });
      this.streamProcess.kill('SIGKILL');
    });
  }
}
