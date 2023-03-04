import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Snapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  date: Date;

 }
 