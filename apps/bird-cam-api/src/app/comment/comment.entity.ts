import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity()
export class Comment {
  @Column()
  author: string;

  @CreateDateColumn()
  public createdAt: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
