import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ShipperEntity } from 'src/models/shippers/entities/shippers.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';

@Entity({ name: 'kitchens' })
export class KitchenEntity extends BaseEntity {
  @Column()
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @Column()
  @AutoMap()
  @IsNotEmpty()
  address: string;

  @Column({ length: 10 })
  @AutoMap()
  @IsNotEmpty()
  phone: string;

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;

  @OneToMany(() => ShipperEntity, (shipper) => shipper.kitchen)
  shippers: ShipperEntity[];

  @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.kitchen)
  deliveryTrips: DeliveryTripEntity[];
}
