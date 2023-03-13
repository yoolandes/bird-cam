import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LiveStreamFacade } from './+state/live-stream.facade';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [LiveStreamFacade],
})
export class LiveStreamInfrastructureModule {}
