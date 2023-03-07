import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Snapshot } from './snapshot.entity';
import { Express } from 'express';

import { SnapshotService } from './snapshot.service';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';

@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createSnapshotDto: CreateSnapshotDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    createSnapshotDto.filePath = file.path;
    return this.snapshotService.create(createSnapshotDto);
  }

  @Get()
  findAll(): Promise<Snapshot[]> {
    return this.snapshotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Snapshot> {
    return this.snapshotService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.snapshotService.remove(id);
  }
}
