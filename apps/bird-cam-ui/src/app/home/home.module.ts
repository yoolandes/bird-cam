import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslocoModule } from '@ngneat/transloco';
import { CommentsUiModule } from '@bird-cam/comments/ui';
import { LiveStreamUiModule } from 'libs/live-stream/ui/src';
import { ActiveViewersUiModule } from '@bird-cam/active-viewers/ui';
import { PushSubscriberUiModule } from '@bird-cam/push-subscriber/ui';

@NgModule({
  imports: [
    CommentsUiModule,
    HomePageRoutingModule,
    IonicModule,
    LiveStreamUiModule,
    TranslocoModule,
    ActiveViewersUiModule,
    PushSubscriberUiModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
