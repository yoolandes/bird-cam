import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsUiModule } from '@bird-cam/comments/ui';
import { LiveStreamUiModule } from 'libs/live-stream/ui/src';

@NgModule({
  imports: [CommentsUiModule, HomePageRoutingModule, IonicModule, LiveStreamUiModule, TranslateModule ],
  declarations: [HomePage],
})
export class HomePageModule {}
