import { Injectable } from '@angular/core';
import { ActiveViewersDataService } from '@bird-cam/active-viewers/infrastructure';
import { map, Observable } from 'rxjs';
import { ActiveViewers } from '../../../model/src';

@Injectable({
  providedIn: 'root',
})
export class ActiveViewersService {
  readonly activeViewers$: Observable<ActiveViewers> =
    this.activeViewersDataService.activeViewers$.pipe(
      map((res) => {
        return {
          activeViewers: res.activeViewers || 1,
        };
      })
    );

  constructor(
    private readonly activeViewersDataService: ActiveViewersDataService
  ) {}
}
