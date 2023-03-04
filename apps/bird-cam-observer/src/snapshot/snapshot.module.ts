import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";

import { SnapshotService } from './snapshot.service';

@Module({
  imports: [HttpModule],
  providers: [SnapshotService],
  exports: [SnapshotService],
})
export class SnapshotModule {

}
