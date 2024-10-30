import { LoggerService } from '@bird-cam/logger';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, exhaustMap, of, skip } from 'rxjs';
import { MotionDetectorService } from '../motion-detector/motion-detector.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  now: string;

  private readonly birdCamApiHost: string;

  constructor(
    private readonly motionDetectorService: MotionDetectorService,
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService
  ) {
    this.birdCamApiHost =
      this.configService.getOrThrow<string>('BIRDCAM_API_HOST');

    this.motionDetectorService.motionDetected$
      .pipe(
        skip(1),
        exhaustMap((motionDetected) =>
          this.httpService
            .post(this.birdCamApiHost + '/api/motion', {
              motionDetected,
            })
            .pipe(
              catchError((err) => {
                this.loggerService.error(err);
                return of();
              })
            )
        )
      )
      .subscribe();
  }
}
