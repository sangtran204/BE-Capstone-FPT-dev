import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { OrderProfile } from './profile/order.profile';
import { OrderEntity } from './entities/order.entity';
import { CustomersModule } from '../customers/customers.module';
import { PackagesModule } from '../packages/packages.module';
import { FirebaseProviderModule } from 'src/providers/firebase/provider.module';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    CustomersModule,
    PackagesModule,
    FirebaseProviderModule,
    NotificationsModule,
    // VnpayProviderModule,
    // PaymentsModule,
    // BanksModule,
    // CommissionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderProfile],
  exports: [OrdersService],
})
export class OrdersModule {}
