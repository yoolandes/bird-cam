import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsCreateComponent } from './comments-create/comments-create.component';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { CommentsPreviewComponent } from './comments-preview/comments-preview.component';
import { IonicModule } from '@ionic/angular';
import {
  TranslocoModule,
} from '@ngneat/transloco';
import { CommentSortPipe } from './pipes/commtent-sorter.pipe';
import { CommentsDetailComponent } from './comments-detail/comments-detail.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentsInfrastructureModule } from 'libs/comments/infrastructure/src';
@NgModule({
  imports: [CommonModule, CommentsInfrastructureModule, IonicModule, ReactiveFormsModule, TranslocoModule],
  declarations: [
    CommentsCreateComponent,
    CommentsListComponent,
    CommentsPreviewComponent,
    CommentSortPipe,
    CommentsDetailComponent,
    RelativeDatePipe,
  ],
  exports: [
    CommentsPreviewComponent
  ]
})
export class CommentsUiModule {}
