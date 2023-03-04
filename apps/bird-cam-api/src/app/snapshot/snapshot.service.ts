import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Snapshot } from './snapshot.entity';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import * as fs from 'fs';


@Injectable()
export class SnapshotService {
  constructor(
    @InjectRepository(Snapshot)
    private readonly snapshotRepository: Repository<Snapshot>,
  ) {}

  create(createSnapshotDto: CreateSnapshotDto): any {
    const snapshot = new Snapshot();

    snapshot.filePath = createSnapshotDto.filePath;
    snapshot.date =  new Date(createSnapshotDto.date);
  
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
