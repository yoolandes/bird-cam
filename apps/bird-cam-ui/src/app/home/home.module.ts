import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LiveStreamModule } from '@bird-cam/live-stream';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsUiModule } from '@bird-cam/comments/ui';

@NgModule({
  imports: [CommentsUiModule, HomePageRoutingModule, IonicModule, LiveStreamModule, TranslateModule ],
  declarations: [HomePage],
})
export class HomePageModule {}
