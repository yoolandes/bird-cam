import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import {
  finalize,
  Observable,
  ReplaySubject,
  share,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { Repository } from 'typeorm';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { CreateSnapshotDto } from '../infrastructure/model/create-snapshot.dto';
import { Snapshot } from '../infrastructure/model/snapshot.entity';
import { SnapshotCaptureService } from '../infrastructure/snapshot-capture.service';
import { LoggerService } from '@bird-cam/logger';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';

@Injectable()
export class SnapshotService {
  snapshotPath: string;
  birdcamRTSP: string;
  birdcamRTSPUsername: string;
  birdcamRTSPPassword: string;

  snapshot$: Observable<string>;

  constructor(
    @InjectRepository(Snapshot)
    private readonly snapshotRepository: Repository<Snapshot>,
    private readonly snapshotCaptureService: SnapshotCaptureService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly streamingService: StreamingService
  ) {
    this.snapshotPath = this.configService.getOrThrow<string>('SNAPSHOT_PATH');
    this.birdcamRTSP = this.configService.getOrThrow<string>('BIRDCAM_RTSP');
    this.birdcamRTSPUsername = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_USERNAME'
    );
    this.birdcamRTSPPassword = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_PASSWORD'
    );

    this.snapshot$ = this.streamingService.startBirdCamForSnapshot().pipe(
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
      }),
      share({
        resetOnRefCountZero: () => timer(30000),
        connector: () => new ReplaySubject(1),
        resetOnComplete: false,
      })
    );
  }

  create(createSnapshotDto: CreateSnapshotDto): Promise<Snapshot> {
    const snapshot = new Snapshot();

    snapshot.filePath = createSnapshotDto.filePath;
    snapshot.date = new Date(createSnapshotDto.date);

    return this.snapshotRepository.save(snapshot);
  }

  createFromFile(base64: string, date: Date): Promise<Snapshot> {
    const snapshot = new Snapshot();
    const filePath =
      this.snapshotPath +
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '.jpg';
    fs.appendFileSync(filePath, Buffer.from(base64, 'base64'));

    snapshot.filePath = filePath;
    snapshot.date = date;

    return this.snapshotRepository.save(snapshot);
  }

  async findAll(): Promise<Snapshot[]> {
    return this.snapshotRepository.find();
  }

  findOne(id: number): Promise<Snapshot> {
    return this.snapshotRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.snapshotRepository.delete(id);
  }
}
