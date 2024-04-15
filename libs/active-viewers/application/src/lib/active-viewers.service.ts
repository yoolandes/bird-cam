import { Injectable } from '@angular/core';
import { ActiveViewersDataService } from '@bird-cam/active-viewers/infrastructure';
import { Observable, startWith } from 'rxjs';
import { ActiveViewers } from '../../../model/src';

@Injectable({
  providedIn: 'root',
})
export class ActiveViewersService {
  readonly activeViewers$: Observable<ActiveViewers> =
    this.activeViewersDataService.activeViewers$.pipe(
      startWith({ activeViewers: 0 })
    );

  constructor(
    private readonly activeViewersDataService: ActiveViewersDataService
  ) {}
}
