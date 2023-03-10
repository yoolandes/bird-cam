import { Comment } from '@bird-cam/comments/model';
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity()
export class CommentEntity implements Comment {
  @Column()
  author: string;

  @CreateDateColumn()
  createdAt: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @UpdateDateColumn()
  updatedAt: string;
}
