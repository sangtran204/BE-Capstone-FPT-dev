import { AutoMap } from '@automapper/classes';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { BatchEntity } from 'src/models/batchs/entities/batch.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
// import { FoodEntity } from 'src/models/foods/entities/foods.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { SessionEntity } from 'src/models/sessions/entities/sessions.entity';
import { StationEntity } from 'src/models/stations/entities/stations.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({ default: OrderEnum.PENDING })
  @AutoMap()
  status: string;

  @AutoMap(() => SubscriptionEntity)
  @ManyToOne(() => SubscriptionEntity, (subscription) => subscription.orders, {
    nullable: false,
  })
  subscription: SubscriptionEntity;

  @AutoMap(() => PackageItemEntity)
  @ManyToOne(() => PackageItemEntity, (packageItem) => packageItem.orders, {
    nullable: false,
  })
  packageItem: PackageItemEntity;

  // @AutoMap(() => TimeSlotEntity)
  // @ManyToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.orders)
  // timeSlot: TimeSlotEntity;

  @AutoMap(() => StationEntity)
  @ManyToOne(() => StationEntity, (station) => station.orders)
  station: StationEntity;

  // @AutoMap(() => KitchenEntity)
  // @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.orders)
  // kitchen: KitchenEntity;

  // @AutoMap(() => DeliveryTripEntity)
  // @ManyToOne(() => DeliveryTripEntity, (deliveryTrips) => deliveryTrips.order)
  // deliveryTrips: DeliveryTripEntity;

  @ManyToOne(() => SessionEntity, (session) => session.orders)
  session: SessionEntity;

  @ManyToOne(() => BatchEntity, (batch) => batch.orders)
  batch: BatchEntity;
}
