import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ViewActivity } from '@bird-cam/active-viewers/model';

@Entity({
  name: 'viewActivity',
})
export class ViewActivityEntity implements ViewActivity {
  @CreateDateColumn()
  createdAt: string;

  @PrimaryGeneratedColumn()
  id: number;
}
