import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MotionActivityActions } from './motion-activity.actions';
import { MotionActivitySelectors } from './motion-activity.selectors';

@Injectable({
  providedIn: 'root',
})
export class MotionActivityFacadeService {
  motionActivity$ = this.store.pipe(
    select(MotionActivitySelectors.selectMotionActivity)
  );

  constructor(private readonly store: Store) {}

  getMotionActivity(): void {
    this.store.dispatch(MotionActivityActions.getMotionActivity());
  }
}
