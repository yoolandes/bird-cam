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
import { Express } from 'express';

import { SnapshotService } from '../application/snapshot.service';
import { CreateSnapshotDto } from './model/create-snapshot.dto';
import { SnapshotEntity } from './model/snapshot.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

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
  findAll(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<SnapshotEntity>> {
    return this.snapshotService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SnapshotEntity> {
    return this.snapshotService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.snapshotService.remove(id);
  }
}
