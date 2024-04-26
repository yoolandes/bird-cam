import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveViewersService } from './application/active-viewers.service';
import { ActiveViewers } from '@bird-cam/active-viewers/model';

@Controller('active-viewers')
export class ActiveViewersController {
  constructor(private readonly activeViewersService: ActiveViewersService) {}
  @Get()
  get(): ActiveViewers {
    return {
      activeViewers: this.activeViewersService.activeViewers,
    };
  }
}
