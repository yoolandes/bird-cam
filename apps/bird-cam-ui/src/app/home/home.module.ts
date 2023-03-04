import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { CommentsModule } from '@bird-cam/comments';
import { HomePageRoutingModule } from './home-routing.module';
import { LiveStreamModule } from '@bird-cam/live-stream';

@NgModule({
  imports: [CommentsModule, HomePageRoutingModule, IonicModule, LiveStreamModule ],
  declarations: [HomePage],
})
export class HomePageModule {}
