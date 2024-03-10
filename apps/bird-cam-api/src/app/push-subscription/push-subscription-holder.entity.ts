import { PushSubscriptionHolder } from '@bird-cam/motion-notifier/model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'pushSubscription',
})
export class PushSubscriptionHolderEntity implements PushSubscriptionHolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  pushSubscriptionJSON: PushSubscriptionJSON;
}
