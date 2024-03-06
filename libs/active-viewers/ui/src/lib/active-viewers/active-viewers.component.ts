import { Component } from '@angular/core';
import { ActiveViewersService } from '@bird-cam/active-viewers/application';

@Component({
  selector: 'bird-cam-active-viewers',
  templateUrl: './active-viewers.component.html',
})
export class ActiveViewersComponent {
  constructor(readonly activeViewersService: ActiveViewersService) {}
}
