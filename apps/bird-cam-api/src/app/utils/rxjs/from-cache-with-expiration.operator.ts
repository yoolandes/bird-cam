import { asyncScheduler, AsyncSubject, Observable, SchedulerLike } from 'rxjs';

export const fromCacheWithExpiration =
  <T>(expirationMs: number, scheduler: SchedulerLike = asyncScheduler) =>
  (source: Observable<T>) => {
    let cached: AsyncSubject<T> | null;
    return new Observable<T>((observer) => {
      if (!cached) {
        cached = new AsyncSubject();
        source.subscribe(cached);
        cached.subscribe(() => {
          scheduler.schedule(() => {
            cached = null;
          }, expirationMs);
        });
      }
      return cached.subscribe(observer);
    });
  };
