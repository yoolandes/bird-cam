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

  create(createDetectionDto: CreateSnapshotDto): any {
    const detection = new Snapshot();

    const date = new Date(createDetectionDto.date);
   
    const filename = date.toISOString().slice(0,19).replace( /[-:]/g, '') + ".png";

    detection.filename = filename;
    detection.date =  date;

    fs.writeFile("./apps/api/src/assets/" + filename, createDetectionDto.base64, 'base64', (err) => {
        if(err) {
            console.log(err);
        }
        return this.snapshotRepository.save(detection);
      });
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
