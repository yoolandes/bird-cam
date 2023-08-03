import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as CommentsActions from './comments.actions';
import { CommentsEffects } from './comments.effects';
import { CommentsFacade } from './comments.facade';
import { CommentsEntity } from './comments.models';
import {
  COMMENTS_FEATURE_KEY,
  CommentsState,
  initialCommentsState,
  commentsReducer,
} from './comments.reducer';
import * as CommentsSelectors from './comments.selectors';

interface TestSchema {
  comments: CommentsState;
}

describe('CommentsFacade', () => {
  let facade: CommentsFacade;
  let store: Store<TestSchema>;
  const createCommentsEntity = (id: string, name = ''): CommentsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(COMMENTS_FEATURE_KEY, commentsReducer),
          EffectsModule.forFeature([CommentsEffects]),
        ],
        providers: [CommentsFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(CommentsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allComments$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allComments$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadCommentsSuccess` to manually update list
     */
    it('allComments$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allComments$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        CommentsActions.loadCommentsSuccess({
          comments: [createCommentsEntity('AAA'), createCommentsEntity('BBB')],
        })
      );

      list = await readFirst(facade.allComments$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
