import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MotionActivity } from '@bird-cam/motion-activity/model';

@Entity({
  name: 'motionActivity',
})
export class MotionActivityEntity implements MotionActivity {
  @CreateDateColumn()
  createdAt: string;

  @PrimaryGeneratedColumn()
  id: number;
}
