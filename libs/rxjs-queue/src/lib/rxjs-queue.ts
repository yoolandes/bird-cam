import { Observable, Subject, delayWhen, finalize, mergeMap, of } from 'rxjs';

type PendingObservable = Observable<any>;
type PendingSubject = Subject<any>;
type PendingType = PendingSubject | PendingObservable;

export const createRxJsQueue = () => {
  let pending: PendingType = of(null);

  const getPrevious = () => {
    return pending;
  };

  const finish = (pendingSubject: PendingSubject) => {
    if (pending === pendingSubject) {
      pending = of(null);
    }
    if (pendingSubject.next) {
      pendingSubject.next('onComplete');
      pendingSubject.complete();
    }
  };

  const createPendingSubject = () => {
    pending = new Subject();
    return pending;
  };

  const getSubjects = () => {
    return [getPrevious(), createPendingSubject()];
  };

  return function () {
    return function <T>(source: Observable<T>) {
      const [prevSubject, currentSubject] = getSubjects();

      return of(null).pipe(
        delayWhen(() => prevSubject),
        mergeMap(() =>
          source.pipe(
            finalize(() => {
              finish(currentSubject as PendingSubject);
            })
          )
        )
      );
    };
  };
};
