import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DeliveryTripEntity } from './entities/deliveryTrip.entity';
import { DeliveryTripProfile } from './profile/deliveryTrip.profile';
import { StationsModule } from '../stations/stations.module';
import { DeliveryTripController } from './deliveryTrip.controller';
import { DeliveryTripService } from './deliveryTrip.service';
import { KitchenModule } from '../kitchens/kitchens.module';
import { ShippersModule } from '../shippers/shippers.module';
import { OrdersModule } from '../orders/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryTripEntity]),
    StationsModule,
    OrdersModule,
    KitchenModule,
    ShippersModule,
  ],
  controllers: [DeliveryTripController],
  providers: [DeliveryTripService, DeliveryTripProfile],
  exports: [DeliveryTripService],
})
export class DeliveryTripModule {}
