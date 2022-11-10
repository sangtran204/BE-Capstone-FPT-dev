import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VnpayConfigService {
  constructor(private configService: ConfigService) {}

  get tmnCode(): string {
    return this.configService.get<string>('vnpay.tmnCode');
  }
  get hashSecret(): string {
    return this.configService.get<string>('vnpay.hashSecret');
  }
  get url(): string {
    return this.configService.get<string>('vnpay.url');
  }
  get returnUrl(): string {
    return this.configService.get<string>('vnpay.returnUrl');
  }
}
