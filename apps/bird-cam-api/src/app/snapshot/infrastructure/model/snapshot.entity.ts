import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Snapshot, SnapshotCause } from '@bird-cam/snapshot/model';

@Entity({
  name: 'snapshot',
})
export class SnapshotEntity implements Snapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: SnapshotCause,
    nullable: true,
  })
  snapshotCause: SnapshotCause;
}
