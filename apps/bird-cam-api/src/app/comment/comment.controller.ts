import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { CommentEntity } from './comment.entity';

import { CommentService } from './comment.service';
import { CreateCommentDto } from '@bird-cam/comments/model';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommenttDto: CreateCommentDto) {
    return this.commentService.create(createCommenttDto);
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res): Promise<CommentEntity[]> {
    const [comments, count] = await this.commentService.findAll();
    res.header('X-Total-Count', count);
    return comments;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CommentEntity> {
    return this.commentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commentService.remove(id);
  }
}
