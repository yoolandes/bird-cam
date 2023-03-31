import { Body, Controller, Put } from '@nestjs/common';
import { LedService } from './led.service';

@Controller('led')
export class LedController {

    constructor(
        private readonly ledService: LedService
        ) { }

    @Put()
    setLed(@Body() res: {on: boolean}) {
        if (res.on) {
            return this.ledService.switchOn();
        } else {
            return this.ledService.switchOff();
        }
    }
}
