import { spawn } from 'child_process';
import fs from 'fs';
import { LoggerService } from '@bird-cam/logger';

export class SnapshotService {
  constructor(private readonly loggerService: LoggerService) {}

  getStill(): Promise<string> {
    return new Promise((resolve, reject) => {
      const streamProcess = spawn('rpicam-still', [
        '--output',
        './snapshot.jpg',
        '--width',
        '1920',
        '--height',
        '1080',
        '--nopreview',
        '--quality',
        '60',
        '--immediate',
      ]);

      streamProcess.on('close', (code) => {
        if (code === 0) {
          return resolve(
            fs.readFileSync('./snapshot.jpg', { encoding: 'base64' })
          );
        } else {
          return reject();
        }
      });
    });
  }
}
