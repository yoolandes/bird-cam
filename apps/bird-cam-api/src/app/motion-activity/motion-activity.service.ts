import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotionActivityEntity } from './motion-activity.entity';
import { getHourCounts } from './motion-activity.service.mapper';

@Injectable()
export class MotionActivityService {
  constructor(
    @InjectRepository(MotionActivityEntity)
    private readonly activityEntityRepository: Repository<MotionActivityEntity>
  ) {}

  create(): any {
    return this.activityEntityRepository.save(new MotionActivityEntity());
  }

  async findAllFromLastHours(
    hours: number
  ): Promise<{ [key: number]: number }> {
    const upperDate = new Date();
    upperDate.setMinutes(0);
    upperDate.setSeconds(0);
    upperDate.setMilliseconds(0);

    const lowerDate = new Date(upperDate.getTime());
    lowerDate.setHours(lowerDate.getHours() - hours);

    return this.activityEntityRepository
      .createQueryBuilder('entity')
      .where(
        'entity.createdAt >= :lowerDate AND entity.createdAt < :upperDate',
        { lowerDate, upperDate }
      )
      .getMany()
      .then((motionActivities) => {
        return getHourCounts(
          motionActivities.map((motionActivity) => motionActivity.createdAt),
          lowerDate,
          upperDate
        );
      });
  }
}
