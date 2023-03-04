import { Controller, Put } from '@nestjs/common';
import { LedService } from './led.service';

@Controller('led')
export class LedController {

    constructor(private readonly ledService: LedService) { }

    @Put()
    setLed(on: boolean) {
        if (on) {
            return this.ledService.switchOn();
        } else {
            return this.ledService.switchOff();
        }
    }
}
