import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsCreateComponent } from './comments-create/comments-create.component';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { CommentsPreviewComponent } from './comments-preview/comments-preview.component';
import { IonicModule } from '@ionic/angular';
import {
  TranslocoModule, TRANSLOCO_SCOPE,
} from '@ngneat/transloco';
import { CommentSortPipe } from './pipes/commtent-sorter.pipe';
import { CommentsDetailComponent } from './comments-detail/comments-detail.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentsInfrastructureModule } from 'libs/comments/infrastructure/src';

export const loader = ['de_DE'].reduce((acc: any, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {});

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
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'comments',
        loader
      }
    }
  ],
  exports: [
    CommentsPreviewComponent
  ]
})
export class CommentsUiModule {}
