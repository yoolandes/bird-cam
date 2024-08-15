import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActiveViewerActions } from './active-viewers.actions';
import { ActiveViewersSelectors } from './active-viewers.selectors';

@Injectable({
  providedIn: 'root',
})
export class ActiveViewersFacadeService {
  activeViewers = this.store.pipe(
    select(ActiveViewersSelectors.selectViewerHistory)
  );

  constructor(private readonly store: Store) {}

  getMotionActivity(): void {
    this.store.dispatch(ActiveViewerActions.getViewerHistory());
  }
}
