import { Direction, Edge, Gpio } from 'onoff';

export const createGpio = (
  port: number,
  direction: Direction,
  edge?: Edge
): Gpio => {
  try {
    return new Gpio(port, direction, edge);
  } catch (_) {
    return {
      write: () => undefined,
      watch: () => undefined,
    } as unknown as Gpio;
  }
};
