import { Module } from '@nestjs/common';
import { VnpayConfigModule } from '../../config/vnpay/config.module';
import { VnpayService } from './vnpay.service';

@Module({
  imports: [VnpayConfigModule],
  providers: [VnpayService],
  exports: [VnpayService],
})
export class VnpayProviderModule {}
