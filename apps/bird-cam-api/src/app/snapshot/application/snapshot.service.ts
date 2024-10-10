import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import {
  catchError,
  exhaustMap,
  finalize,
  map,
  Observable,
  ReplaySubject,
  share,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { Repository } from 'typeorm';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { CreateSnapshotDto } from '../infrastructure/model/create-snapshot.dto';
import { SnapshotEntity } from '../infrastructure/model/snapshot.entity';
import { SnapshotCaptureService } from '../infrastructure/snapshot-capture.service';
import { LoggerService } from '@bird-cam/logger';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';
import { SnapshotApiService } from '../infrastructure/snapshot-api.service';
import { LedApiService } from '../infrastructure/led-api.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { SnapshotCause } from '@bird-cam/snapshot/model';

@Injectable()
export class SnapshotService {
  snapshotPath: string;
  birdcamRTSP: string;
  birdcamRTSPUsername: string;
  birdcamRTSPPassword: string;

  snapshot$: Observable<string>;

  constructor(
    @InjectRepository(SnapshotEntity)
    private readonly snapshotRepository: Repository<SnapshotEntity>,
    private readonly snapshotCaptureService: SnapshotCaptureService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly streamingService: StreamingService,
    private readonly snapshotApiService: SnapshotApiService,
    private readonly ledApiService: LedApiService
  ) {
    this.snapshotPath = this.configService.getOrThrow<string>('SNAPSHOT_PATH');
    this.birdcamRTSP = this.configService.getOrThrow<string>('BIRDCAM_RTSP');
    this.birdcamRTSPUsername = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_USERNAME'
    );
    this.birdcamRTSPPassword = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_PASSWORD'
    );

    const getSnapShotLocally$ = this.ledApiService.switchOn().pipe(
      exhaustMap(() => this.snapshotApiService.getSnapshot()),
      exhaustMap((snapshot) =>
        this.ledApiService.switchOff().pipe(map(() => snapshot))
      )
    );

    const snappi$ = this.streamingService.startBirdCamForSnapshot().pipe(
      tap(() => this.loggerService.info('Try tp capture snapshot')),
      switchMap(() =>
        this.snapshotCaptureService.captureSnapshot(
          this.birdcamRTSP,
          this.birdcamRTSPUsername,
          this.birdcamRTSPPassword
        )
      ),
      retryBackoff({
        initialInterval: 5000,
        maxInterval: 1000 * 15,
      }),
      tap(() => this.loggerService.info('Snapshot captured!')),
      finalize(() => {
        this.loggerService.info('Snapshot capturing done!');
        this.streamingService.stopBirdCamForSnapshot().subscribe({
          error: (err) => this.loggerService.error(err),
        });
      })
    );

    this.snapshot$ = this.streamingService.birdcamIsStreaming$.pipe(
      take(1),
      switchMap((birdcamIsStreaming) => {
        if (!birdcamIsStreaming) {
          this.loggerService.log('Take snapshot locally...');
          return getSnapShotLocally$.pipe(
            catchError(() => {
              this.loggerService.error('Cant take snapshot locally!');
              return snappi$;
            }),
            tap(() => this.loggerService.log('Take snapshot locally!'))
          );
        } else {
          return snappi$;
        }
      }),
      share({
        resetOnRefCountZero: () => {
          this.loggerService.error('Ref count is zero!');
          return timer(30000);
        },
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(30000),
      }),
      finalize(() => this.loggerService.log('Ref count  completed!'))
    );
  }

  create(createSnapshotDto: CreateSnapshotDto): Promise<SnapshotEntity> {
    const snapshot = new SnapshotEntity();

    snapshot.filePath = createSnapshotDto.filePath;
    snapshot.date = new Date(createSnapshotDto.date);

    return this.snapshotRepository.save(snapshot);
  }

  createFromFile(
    base64: string,
    date: Date,
    snapshotCause: SnapshotCause
  ): Promise<SnapshotEntity> {
    const snapshot = new SnapshotEntity();
    const filePath =
      this.snapshotPath +
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '.jpg';
    fs.appendFileSync(filePath, Buffer.from(base64, 'base64'));

    snapshot.filePath = filePath;
    snapshot.date = date;
    snapshot.snapshotCause = snapshotCause;

    return this.snapshotRepository.save(snapshot);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<SnapshotEntity>> {
    return paginate(query, this.snapshotRepository, {
      sortableColumns: ['id', 'date', 'filePath', 'snapshotCause'],
      select: ['id', 'filePath', 'date', 'snapshotCause'],
      maxLimit: 500,
      filterableColumns: {
        snapshotCause: true,
        date: true,
      },
    });
  }

  findOne(id: number): Promise<SnapshotEntity> {
    return this.snapshotRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.snapshotRepository.delete(id);
  }
}
