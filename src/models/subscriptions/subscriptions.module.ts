import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionEntity } from './entities/subscription.entity';
// import { CustomersModule } from '../customers/customers.module';
import { PackagesModule } from '../packages/packages.module';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionProfile } from './profile/subscription.profile';
import { VnpayProviderModule } from 'src/providers/vnpay/vnpay.module';
import { PaymentsModule } from '../payment/payments.module';
import { BanksModule } from '../banks/banks.module';
import { OrdersModule } from '../orders/order.module';
import { AccountsModule } from '../accounts/accounts.module';
import { FeedBackModule } from '../feedback/feedback.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    AccountsModule,
    // FeedBackModule,
    PackagesModule,
    VnpayProviderModule,
    // NotificationsModule,
    PaymentsModule,
    BanksModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionProfile],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
