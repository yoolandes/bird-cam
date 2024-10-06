import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewActivityEntity } from './view-activity.entity';
import { getHourCounts } from '../utils/statistics/hours-count';

@Injectable()
export class ViewActivityService {
  constructor(
    @InjectRepository(ViewActivityEntity)
    private readonly viewEntityRepository: Repository<ViewActivityEntity>
  ) {}

  create(): any {
    return this.viewEntityRepository.save(new ViewActivityEntity());
  }

  async findAllFromLastHours(
    hours: number
  ): Promise<{ [key: number]: number }> {
    const upperDate = new Date();
    upperDate.setMinutes(0);
    upperDate.setSeconds(0);
    upperDate.setMilliseconds(0);
    upperDate.setHours(upperDate.getHours() + 1);

    const lowerDate = new Date(upperDate.getTime());
    lowerDate.setHours(lowerDate.getHours() - hours);

    return this.viewEntityRepository
      .createQueryBuilder('entity')
      .where(
        'entity.createdAt >= :lowerDate AND entity.createdAt < :upperDate',
        { lowerDate, upperDate }
      )
      .getMany()
      .then((viewActivities) => {
        return getHourCounts(
          viewActivities.map((viewActivity) => viewActivity.createdAt),
          lowerDate,
          upperDate
        );
      });
  }
}
