import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';

@NgModule({
  imports: [UiModule],
  exports: [UiModule]
})
export class CommentsModule { }
