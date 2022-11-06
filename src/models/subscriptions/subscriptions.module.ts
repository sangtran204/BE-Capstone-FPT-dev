import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CustomersModule } from '../customers/customers.module';
import { PackagesModule } from '../packages/packages.module';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionProfile } from './profile/subscription.profile';
import { VnpayProviderModule } from 'src/providers/vnpay/vnpay.module';
import { PaymentsModule } from '../payment/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    CustomersModule,
    PackagesModule,
    VnpayProviderModule,
    PaymentsModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionProfile],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
