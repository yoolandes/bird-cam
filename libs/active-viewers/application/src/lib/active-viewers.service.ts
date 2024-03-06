import { Injectable } from '@angular/core';
import { ActiveViewersDataService } from '@bird-cam/active-viewers/infrastructure';

@Injectable({
  providedIn: 'root',
})
export class ActiveViewersService {
  readonly activeViewers$ = this.activeViewersDataService.activeViewers$;

  constructor(
    private readonly activeViewersDataService: ActiveViewersDataService
  ) {}
}
