import { Injectable } from '@nestjs/common';
import { Gpio } from 'onoff';
import { LoggerService } from '../logger/logger.service';
import { createGpio } from '../utils/gpio';

@Injectable()
export class LedService {

  readonly led: Gpio = createGpio(21, 'out', undefined, this.loggerService);

  private readonly timeOutDuration = 300000;

  private ledTimeout?: NodeJS.Timeout;

  constructor(private readonly loggerService: LoggerService) {

  }

  async switchOn(): Promise<void> {
    await this.led.write(1);
    this.autoSwitchOff(this.timeOutDuration);
  }


  async switchOff(): Promise<void> {
    await this.led.write(0);
    clearTimeout(this.ledTimeout);
  }

  private autoSwitchOff(duration: number): void {
    this.ledTimeout = setTimeout(() => {
      this.switchOff();
    }, duration);
  }

}
