import { delay, of } from 'rxjs';
import { createRxJsQueue } from './rxjs-queue';

describe('RxJsQueue', () => {
  it('should be created', (done) => {
    const rxJsQueue = createRxJsQueue();

    of(undefined)
      .pipe(delay(2000), rxJsQueue())
      .subscribe(() => {
        console.log('hey');
      });

    of(undefined)
      .pipe(delay(50), rxJsQueue())
      .subscribe(() => {
        console.log('hey1');
        done();
      });
  });
});
