import { AutoMap } from '@automapper/classes';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { FoodEntity } from 'src/models/foods/entities/foods.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { StationEntity } from 'src/models/stations/entities/stations.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column('date')
  @AutoMap()
  deliveryDate: Date;

  @Column()
  @AutoMap()
  priceFood: number;

  @Column()
  @AutoMap()
  nameFood: string;

  @Column({ default: OrderEnum.PROGRESS })
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

  @AutoMap(() => FoodEntity)
  @ManyToOne(() => FoodEntity, (food) => food.orders)
  food: FoodEntity;

  @AutoMap(() => TimeSlotEntity)
  @ManyToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.orders)
  timeSlot: TimeSlotEntity;

  @AutoMap(() => StationEntity)
  @ManyToOne(() => StationEntity, (station) => station.orders)
  station: StationEntity;

  @AutoMap(() => KitchenEntity)
  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.orders)
  kitchen: KitchenEntity;

  @AutoMap(() => DeliveryTripEntity)
  @ManyToOne(() => DeliveryTripEntity, (deliveryTrips) => deliveryTrips.order)
  deliveryTrips: DeliveryTripEntity;
}
