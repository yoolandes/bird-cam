import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { CommentsPreviewComponent } from './comments-preview/comments-preview.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { CommentsDetailComponent } from './comments-detail/comments-detail.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { CommentsCreateComponent } from './comments-create/comments-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentSortPipe } from './pipes/commtent-sorter.pipe';

@NgModule({
  declarations: [
    CommentsPreviewComponent,
    CommentsListComponent,
    CommentsDetailComponent,
    RelativeDatePipe,
    CommentsCreateComponent,
    CommentSortPipe
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TranslateModule],
  exports: [CommentsPreviewComponent],
})
export class UiModule {}
