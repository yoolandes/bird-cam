import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors   } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Snapshot } from './snapshot.entity';
import { Express } from 'express';

import { SnapshotService } from './snapshot.service';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';


@Controller('snapshot')
export class SnapshotController {

  constructor(private readonly detectionService: SnapshotService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createDetectionDto: CreateSnapshotDto, @UploadedFile() file: any,) {
    console.log(file);
    // return this.detectionService.create(createDetectionDto);
  }

  @Get()
  findAll(): Promise<Snapshot[]> {
    return this.detectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Snapshot> {
    return this.detectionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.detectionService.remove(id);
  }
}
