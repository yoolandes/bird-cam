import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from '@bird-cam/comments/model';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity> 
  ) {}

  create(createSnapshotDto: CreateCommentDto): any {
    const comment = new CommentEntity();

    comment.author = createSnapshotDto.author;
    comment.text = createSnapshotDto.text;

    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<[CommentEntity[], number]> {
    return this.commentRepository.findAndCount();
  }

  findOne(id: number): Promise<CommentEntity> {
    return this.commentRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
