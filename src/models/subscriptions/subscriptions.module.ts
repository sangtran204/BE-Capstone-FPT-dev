import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CustomersModule } from '../customers/customers.module';
import { PackagesModule } from '../packages/packages.module';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionProfile } from './profile/subscription.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    CustomersModule,
    PackagesModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionProfile],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
