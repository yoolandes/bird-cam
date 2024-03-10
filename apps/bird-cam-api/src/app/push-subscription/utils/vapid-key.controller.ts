import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('vapid')
export class VapidKeyController {
  private vapidPublicKey: string;
  constructor(private readonly configService: ConfigService) {
    this.vapidPublicKey =
      this.configService.getOrThrow<string>('VAPID_PUBLIC_KEY');
  }

  @Get()
  get(): {
    vapidPublicKey: string;
  } {
    return {
      vapidPublicKey: this.vapidPublicKey,
    };
  }
}
