import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'shippers' })
export class ShipperEntity extends BaseEntity {
  @Column()
  @AutoMap()
  noPlate: string;

  @Column()
  @AutoMap()
  vehicleType: string;

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;

  @AutoMap(() => KitchenEntity)
  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.shippers)
  kitchen: KitchenEntity;

  @OneToMany(() => DeliveryTripEntity, (trip) => trip.shipper)
  trips: DeliveryTripEntity[];
}
