import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscriptionHolderEntity } from './push-subscription-holder.entity';
import { CreatePushSubscriptionHolderDto } from '@bird-cam/push-subscriber/model';
import * as webpush from 'web-push';
import { PushSubscription } from 'web-push';
import { ConfigService } from '@nestjs/config';
import { forkJoin, from, Observable, switchMap } from 'rxjs';

@Injectable()
export class PushSubscriptionService {
  constructor(
    @InjectRepository(PushSubscriptionHolderEntity)
    private readonly pushSubscriptionHolderRepository: Repository<PushSubscriptionHolderEntity>,
    private readonly configService: ConfigService
  ) {
    webpush.setVapidDetails(
      this.configService.getOrThrow<string>('VAPID_EMAIL'),
      this.configService.getOrThrow<string>('VAPID_PUBLIC_KEY'),
      this.configService.getOrThrow<string>('VAPID_PRIVATE_KEY')
    );
  }

  create(
    createPushSubscriptionHolderDto: CreatePushSubscriptionHolderDto
  ): any {
    return this.pushSubscriptionHolderRepository.save(
      createPushSubscriptionHolderDto
    );
  }

  sendNotification(body: string, title: string): Observable<any> {
    return from(this.pushSubscriptionHolderRepository.find()).pipe(
      switchMap((pushSubscriptions) => {
        return forkJoin(
          pushSubscriptions.map(({ pushSubscriptionJSON }) => {
            return webpush.sendNotification(
              pushSubscriptionJSON as PushSubscription,
              JSON.stringify({
                notification: {
                  title,
                  silent: false,
                  renotify: true,
                  body,
                  tag: 'motion',
                  data: {
                    onActionClick: {
                      default: { operation: 'focusLastFocusedOrOpen' },
                    },
                  },
                },
              }),
              {
                urgency: 'high',
                timeout: 30,
              }
            );
          })
        );
      })
    );
  }
}
