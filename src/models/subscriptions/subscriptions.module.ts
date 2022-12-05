import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CustomersModule } from '../customers/customers.module';
import { PackagesModule } from '../packages/packages.module';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionProfile } from './profile/subscription.profile';
import { VnpayProviderModule } from 'src/providers/vnpay/vnpay.module';
import { PaymentsModule } from '../payment/payments.module';
import { BanksModule } from '../banks/banks.module';
import { OrdersModule } from '../orders/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    CustomersModule,
    PackagesModule,
    VnpayProviderModule,
    PaymentsModule,
    BanksModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionProfile],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
