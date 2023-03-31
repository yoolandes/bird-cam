import { Direction, Edge, Gpio } from 'onoff';
import { LoggerService } from '../logger/logger.service';

export const createGpio = (
  port: number,
  direction: Direction,
  edge?: Edge,
  logger?: LoggerService
): Gpio => {
  try {
    return new Gpio(port, direction, edge);
  } catch (err) {
    logger?.warn('Can not access Gpios. Running with stub.');
    return {
      write: () => undefined,
      watch: () => undefined,
    } as unknown as Gpio;
  }
};
