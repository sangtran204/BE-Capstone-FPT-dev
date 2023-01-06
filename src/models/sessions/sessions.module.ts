import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchModule } from '../batchs/batch.module';
import { DeliveryTripModule } from '../deliveryTrips/deliveryTrip.module';
import { KitchenModule } from '../kitchens/kitchens.module';
import { OrdersModule } from '../orders/order.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { SessionEntity } from './entities/sessions.entity';
import { SessionProfile } from './profile/sessions.profile';
import { SessionControler } from './sessions.controller';
import { SessionService } from './sessions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    KitchenModule,
    TimeSlotsModule,
    forwardRef(() => DeliveryTripModule),
    forwardRef(() => OrdersModule),
    BatchModule,
  ],
  controllers: [SessionControler],
  providers: [SessionService, SessionProfile],
  exports: [SessionService],
})
export class SessionModule {}
