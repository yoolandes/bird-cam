import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Snapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  date: Date;

 }
 