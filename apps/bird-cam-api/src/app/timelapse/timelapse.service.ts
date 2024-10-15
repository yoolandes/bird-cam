import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class TimelapseService {
  readonly snapshotPath: string;

  constructor(private readonly configService: ConfigService) {
    this.snapshotPath = this.configService.getOrThrow<string>('SNAPSHOT_PATH');
  }

  getTimelapse(): string {
    return join(this.snapshotPath + 'timelapse.mp4');
  }
}
