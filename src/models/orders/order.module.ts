import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { OrderProfile } from './profile/order.profile';
import { OrderEntity } from './entities/order.entity';
import { FirebaseProviderModule } from 'src/providers/firebase/provider.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SubscriptionModule } from '../subscriptions/subscriptions.module';
import { FoodsModule } from '../foods/foods.module';
import { PackageItemModule } from '../package-item/package-item.module';
import { StationsModule } from '../stations/stations.module';
import { KitchenModule } from '../kitchens/kitchens.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    SubscriptionModule,
    FoodsModule,
    PackageItemModule,
    StationsModule,
    KitchenModule,
    TimeSlotsModule,

    FirebaseProviderModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderProfile],
  exports: [OrdersService],
})
export class OrdersModule {}
