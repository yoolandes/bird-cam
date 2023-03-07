import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  create(createSnapshotDto: CreateCommentDto): any {
    const comment = new Comment();

    comment.author = createSnapshotDto.author;
    comment.text = createSnapshotDto.text;

    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<[Comment[], number]> {
    return this.commentRepository.findAndCount();
  }

  findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
