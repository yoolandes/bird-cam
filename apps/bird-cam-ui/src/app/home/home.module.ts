import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslocoModule } from '@ngneat/transloco';
import { CommentsUiModule } from '@bird-cam/comments/ui';
import { LiveStreamUiModule } from 'libs/live-stream/ui/src';
import { ActiveViewersUiModule } from '@bird-cam/active-viewers/ui';
import { PushSubscriberUiModule } from '@bird-cam/push-subscriber/ui';
import { MotionActivityUiModule } from '@bird-cam/motion-activity/ui';
import { SnapshotUiModule } from '@bird-cam/snapshot/ui';
import { AppVersionComponent } from '@bird-cam/app-version/ui';

@NgModule({
  imports: [
    CommentsUiModule,
    HomePageRoutingModule,
    IonicModule,
    LiveStreamUiModule,
    TranslocoModule,
    ActiveViewersUiModule,
    PushSubscriberUiModule,
    MotionActivityUiModule,
    SnapshotUiModule,
    AppVersionComponent,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
