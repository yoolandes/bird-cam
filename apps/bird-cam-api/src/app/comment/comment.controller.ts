import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res
} from '@nestjs/common';
import { Comment } from './comment.entity';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommenttDto: CreateCommentDto,
  ) {
    return this.commentService.create(createCommenttDto);
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res): Promise<Comment[]> {
    const [comments, count] =  await this.commentService.findAll();
    res.header('X-Total-Count', count);
    return comments;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commentService.remove(id);
  }
}
