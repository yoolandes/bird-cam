import { Controller, Get } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';

@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

  @Get()
  setStreaming(): Promise<string> {
    return this.snapshotService.getStill();
  }
}
